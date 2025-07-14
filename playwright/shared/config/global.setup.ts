import { Console } from 'console';
import { test as setup } from '../fixture/fixture';
import fs from 'fs';

setup('Realiza o truncate das tabelas do banco', async ({ database }) => {
  const commandsResult = await database.query(
    "select 'TRUNCATE TABLE ' || tablename || ' CASCADE' as query from pg_tables where schemaname = 'public';"
  );

  const commands = commandsResult.rows;

  for (const command of commands.map((e) => e['query'])) {
    await database.query(command);
  }
});
