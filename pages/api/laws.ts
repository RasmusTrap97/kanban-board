import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const lawsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get('https://oda.ft.dk/api/Sag', {
      params: {
        $filter: "(typeid eq 3 or typeid eq 5 or typeid eq 9) and periodeid eq 160",
      },
    });

    res.status(200).json(response.data.value);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default lawsHandler;
