import express from 'express';
import { ortschaftZuKanton } from '@shared/lib/kantone';

const router = express.Router();

router.get('/search', (req, res) => {
  try {
    const query = (req.query.q as string)?.toLowerCase() || '';
    
    if (query.length < 2) {
      return res.json({ locations: [] });
    }

    const suggestions = Object.keys(ortschaftZuKanton)
      .filter(ort => ort.toLowerCase().includes(query))
      .slice(0, 10); // Begrenzen auf 10 Vorschläge

    return res.json({ locations: suggestions });
  } catch (error) {
    console.error('Fehler bei der Ortschaftssuche:', error);
    return res.status(500).json({ 
      error: 'Interner Serverfehler bei der Ortschaftssuche',
      locations: [] 
    });
  }
});

export default router; 