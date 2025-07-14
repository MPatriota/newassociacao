import { Client } from 'pg';

export async function criarMarcador(database: Client, slug: string, name: string, color: string) {
  await database.query(
    `INSERT INTO TAG (slug, name, color) VALUES('${slug}', '${name}', '${color}');`
);
}
