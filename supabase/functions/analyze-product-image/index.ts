
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    // Parse the request body
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Analyzing product image with Claude API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a product specialist AI that analyzes images of electronic devices, 
                especially phones and tablets. Extract product information in JSON format with the
                following fields: model, brand, category, and if visible, any identifiers like IMEI or SKU.
                For category, use one of these values if possible: [Smartphone, Tablet, Laptop, Watch, Other].
                If you can't determine a field with high confidence, leave it as null.
                
                Analyze this device and extract product details in JSON format.`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Claude API error:', data.error);
      return new Response(
        JSON.stringify({ error: 'Error analyzing image', details: data.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const content = data.content?.[0]?.text;
    if (!content) {
      throw new Error('No content in the response');
    }

    // Extract JSON from the text response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                      content.match(/{[\s\S]*?}/);
                      
    if (!jsonMatch) {
      throw new Error('No JSON found in the response');
    }
    
    // Parse the JSON content
    let productInfo;
    try {
      // If we matched the code block format, use the first capture group, otherwise use the whole match
      const jsonString = jsonMatch[1] || jsonMatch[0];
      productInfo = JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON from Claude response:', e, 'Raw content:', content);
      return new Response(
        JSON.stringify({ error: 'Failed to parse product information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Successfully extracted product information:', productInfo);

    return new Response(
      JSON.stringify({ productInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-product-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
