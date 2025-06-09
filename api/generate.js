import 'dotenv/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    if (!formData) {
      console.error('No form data provided');
      return res.status(400).json({ error: 'No form data provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `તમારે શ્રી થોરડી પ્રાથમિક શાળામાં થયેલા કાર્યક્રમનો અહેવાલ બનાવવો છે. નીચેની માહિતી આપેલી છે:
    કાર્યક્રમનું નામ: ${formData.eventName}
    તારીખ અને સમય: ${formData.dateTime}
    શિક્ષકોની સંખ્યા: ${formData.teachers}
    છોકરાઓની સંખ્યા: ${formData.boys}
    છોકરીઓની સંખ્યા: ${formData.girls}
    શાળા સંચાલન સમિતિના સભ્યોની સંખ્યા: ${formData.smc}
    ગામડાના લોકોની સંખ્યા: ${formData.villagers}
    ${formData.additionalInfo ? `વધારાની માહિતી: ${formData.additionalInfo}` : ''}
    
    કૃપા કરીને આ માહિતીનો ઉપયોગ કરીને એક પાનાનો અહેવાલ બનાવો.`;

    console.log('Making request to Gemini API...');
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to generate content from Gemini API' });
    }

    const data = await response.json();
    console.log('Successfully received response from Gemini API');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
} 