import { expect } from '@playwright/test';
import { test } from '../../shared/fixture/fixture';

test('Cadastrar marcador com sucesso', async ({ window, adminModule }) => {
  await adminModule.marcadores.acessarMarcadores()
  // await window.locator('a').filter({ hasText: /^Produtos$/ }).click();
  // await window.getByRole('link', { name: ' Tags' }).click();
  await window.getByRole('button', { name: ' Novo' }).click();
  // await page1.getByRole('textbox', { name: 'Nome da Tag' }).click();
  await window.getByRole('textbox', { name: 'Nome do Marcador' }).fill('teste');
  await window.getByRole('textbox', { name: 'Nome do Marcador' }).press('Tab');
  await window.getByText('teste').click();
  await window.locator('.p-colorpicker-color-background').click();
  await window.getByRole('button', { name: 'Salvar' }).click();
});
