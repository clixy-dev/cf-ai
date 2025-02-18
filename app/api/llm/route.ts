import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { callGrokAPI } from '@/utils/llm/grok';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define Zod schema for product data
// const ProductSchema = z.object({
//   products: z.array(z.object({
//     code: z.string(),
//     name: z.string(),
//     description: z.string().optional(),
//     brand: z.string().optional(),
//     categories: z.array(z.string()),
//     packaging: z.array(z.object({
//       quantity: z.number(),
//       unit: z.object({
//         code: z.string(),
//         name: z.string()
//       }),
//       inner_quantity: z.number().optional(),
//       inner_unit: z.object({
//         code: z.string(),
//         name: z.string()
//       }).optional(),
//       inner_pieces: z.number().optional(),
//       price: z.number()
//     }))
//   }))
// });

const ProductSchema = z.object({
  products: z.array(z.object({
    code: z.string(),
    name: z.string(),
    description: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
    packaging: z.array(z.object({
      quantity: z.string(),
      unit: z.string(),
      price: z.number(),
      inner_quantity: z.string().optional(),
      inner_unit: z.string().optional(),
      inner_pieces: z.string().optional()
    })).optional()
  }))
});

export async function POST(req: Request) {
  try {
    const { provider, prompt, context, mode = 'completion' } = await req.json();

    console.log(`provider: ${provider}, prompt: ${prompt}, context: ${context}, mode: ${mode}`);

    let result = '';

    switch (provider) {
      case 'openai':
        if (mode === 'structured') {
          const zodSchema = ProductSchema;

          const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
              {
                role: 'system',
                content: `Extract product information from the provided text.`
              },
              {
                role: 'user',
                content: prompt
              },
              {
                role: 'user',
                content: context
              }
            ],
            response_format: zodResponseFormat(zodSchema, "products"),
            temperature: 0.3,
          });

          console.log('Completion:', JSON.stringify(completion, null, 2));

          result = JSON.stringify(completion.choices[0].message.parsed);
        } else {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            temperature: 0.7,
            max_tokens: 10000,
            messages: [
              {
                role: 'system',
                content: prompt
              },
              {
                role: 'user',
                content: context
              }
            ],
          });
          result = completion.choices[0]?.message?.content || '';
        }
        break;

      case 'gemini':
        const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
        const response = await model.generateContent([
          { text: prompt },
          { text: context }
        ]);
        result = response.response.text();
        break;

      case 'grok':
        result = await callGrokAPI([
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: context
          }
        ]);
        break;

      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    return NextResponse.json({ content: result });
  } catch (error: any) {
    console.error('LLM API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to convert JSON schema to Zod schema
function createZodSchema(schemaObj: any): z.ZodType {
  if (schemaObj.type === 'object') {
    const shape = Object.entries(schemaObj.properties).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: createZodSchema(value)
    }), {});
    return z.object(shape);
  }
  
  if (schemaObj.type === 'array') {
    return z.array(createZodSchema(schemaObj.items));
  }
  
  if (schemaObj.type === 'string') {
    let schema = z.string();
    if (schemaObj.enum) {
      schema = z.enum(schemaObj.enum as [string, ...string[]]);
    }
    return schemaObj.optional ? schema.optional() : schema;
  }
  
  if (schemaObj.type === 'number') {
    return schemaObj.optional ? z.number().optional() : z.number();
  }
  
  return z.any();
} 