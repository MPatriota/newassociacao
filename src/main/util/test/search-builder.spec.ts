import { SearchBuilder } from '../search-builder';

describe('SearchBuilder', () => {

  describe('single statement', () => {

    it('should return simple where equal', () => {

      const whereStatement = SearchBuilder.getStatement('nome==joao');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome = :nome');
      expect(whereStatement.param).toEqual({ nome: 'joao' });

    });

    it('should return where with alias', () => {

      const whereStatement = SearchBuilder.getStatement('nome==joao', 'p');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('p.nome = :nome');
      expect(whereStatement.param).toEqual({ nome: 'joao' });
    });

    it('should return where with not equal', () => {

      const whereStatement = SearchBuilder.getStatement('nome!=joao');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome <> :nome');
      expect(whereStatement.param).toEqual({ nome: 'joao' });

    });

    it('should return where with greater than', () => {

      const whereStatement = SearchBuilder.getStatement('idade>18');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('idade > :idade');
      expect(whereStatement.param).toEqual({ idade: "18" });

    });

    it('should return where with greater than or equal', () => {

      const whereStatement = SearchBuilder.getStatement('idade>=18');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('idade >= :idade');
      expect(whereStatement.param).toEqual({ idade: "18" });

    });

    it('should return where with less than', () => {

      const whereStatement = SearchBuilder.getStatement('idade<18');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('idade < :idade');
      expect(whereStatement.param).toEqual({ idade: "18" });

    });

    it('should return where with like after', () => {

      const whereStatement = SearchBuilder.getStatement('nome=like=joao*');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome like :nome');
      expect(whereStatement.param).toEqual({ nome: 'joao%' });

    });

    it('should return where with like before', () => {

      const whereStatement = SearchBuilder.getStatement('nome=like=*joao');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome like :nome');
      expect(whereStatement.param).toEqual({ nome: '%joao' });

    });

    it('should return where with like before and after', () => {

      const whereStatement = SearchBuilder.getStatement('nome=like=*joao*');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome like :nome');
      expect(whereStatement.param).toEqual({ nome: '%joao%' });

    });

    it('should return where with not like', () => {

      const whereStatement = SearchBuilder.getStatement('nome=notlike=joao*');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome not like :nome');
      expect(whereStatement.param).toEqual({ nome: 'joao%' });

    });

    it('should return where with in', () => {

      const whereStatement = SearchBuilder.getStatement('nome=in=(joao, maria)');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome in (:nome_0, :nome_1)');
      expect(whereStatement.param).toEqual({ nome_0: 'joao', nome_1: 'maria' });

    });

    it('should return where with not in', () => {

      const whereStatement = SearchBuilder.getStatement('nome=notin=(joao, maria)');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome not in (:nome_0, :nome_1)');
      expect(whereStatement.param).toEqual({ nome_0: 'joao', nome_1: 'maria' });

    });

  });

  describe('multiple statements', () => {

    it('should return where with multiple statements', () => {

      const whereStatement = SearchBuilder.getStatement('nome==joao,idade>18');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome = :nome and idade > :idade');
      expect(whereStatement.param).toEqual({ nome: 'joao', idade: '18' });

    });

    it('should return where with multiple statements and alias', () => {

      const whereStatement = SearchBuilder.getStatement('nome==joao,idade>18', 'p');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('p.nome = :nome and p.idade > :idade');
      expect(whereStatement.param).toEqual({ nome: 'joao', idade: '18' });

    });

    it('should return where with multiple statements OR', () => {

      const whereStatement = SearchBuilder.getStatement('nome==joao;idade>18');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('nome = :nome or idade > :idade');
      expect(whereStatement.param).toEqual({ nome: 'joao', idade: '18' });

    });

    it('should return where with multiple statements OR and same field', () => {

      const whereStatement = SearchBuilder.getStatement('nome==produto1;nome==produto2', 'p');

      expect(whereStatement).toBeDefined();
      expect(whereStatement.statement).toBe('p.nome = :nome or p.nome = :nome_2');
      expect(whereStatement.param).toEqual({ nome: 'produto1', nome_2: 'produto2' });

    });

  });

});
