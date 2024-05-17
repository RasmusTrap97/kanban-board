import axios from 'axios';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'db',
  password: 'mypassword',
  port: 5432,
});

const truncateString = (str: string | null, maxLength: number): string | null => {
  if (!str) return null;
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

const fetchDataAndSaveToDatabase = async () => {
  const url = 'https://oda.ft.dk/api/Sag?$filter=(typeid eq 3 or typeid eq 5 or typeid eq 9) and periodeid eq 160';

  try {
    const response = await axios.get(url);
    const data = response.data.value;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const rowData of data) {
        const queryText = `
          INSERT INTO sag (id, typeid, kategoriid, statusid, titel, titelkort, offentlighedskode, nummer, nummerprefix, nummernumerisk, nummerpostfix, resume, afstemningskonklusion, periodeid, opdateringsdato, statsbudgetsag, lovnummer, lovnummerdato)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO NOTHING`;
        const values = [
          rowData.id,
          rowData.typeid,
          rowData.kategoriid,
          rowData.statusid,
          truncateString(rowData.titel, 255),
          truncateString(rowData.titelkort, 255),
          rowData.offentlighedskode,
          rowData.nummer,
          rowData.nummerprefix,
          rowData.nummernumerisk,
          rowData.nummerpostfix,
          truncateString(rowData.resume, 255),
          truncateString(rowData.afstemningskonklusion, 255),
          rowData.periodeid,
          new Date(rowData.opdateringsdato),
          rowData.statsbudgetsag,
          rowData.lovnummer,
          new Date(rowData.lovnummerdato),
        ];
        await client.query(queryText, values);
      }

      await client.query('COMMIT');
      console.log('Data saved to the database successfully.');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching data and saving to database:', error);
  } finally {
    await pool.end();
  }
};

fetchDataAndSaveToDatabase();
