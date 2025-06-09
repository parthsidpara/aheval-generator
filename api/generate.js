export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

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

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
} 