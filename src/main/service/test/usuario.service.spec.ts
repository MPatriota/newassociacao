import { UsuarioService } from '../usuario.service';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let usuarioRepository: any;

  beforeEach(() => {
    usuarioRepository = {
      save: jest.fn(),
      findById: jest.fn(() => Promise.resolve({})),
    }

    usuarioService = new UsuarioService(usuarioRepository);
  })

  it('should throw if redefine senha and usuario is not found', () => {
    usuarioRepository.findById = jest.fn(() => Promise.resolve(undefined));

    expect(() => usuarioService.redefinirSenha(1, 'senha')).rejects.toThrow("Usuário não encontrado");
  })

  it('should throw if current and new senha is the same', () => {
    usuarioRepository.findById = jest.fn(() => Promise.resolve({
      id: 1,
      senha: 'senha123',
    }));

    expect(() => usuarioService.redefinirSenha(1, 'senha123')).rejects.toThrow("A nova senha não pode ser igual a senha atual");
  })

  it('should redefine senha', async () => {
    usuarioRepository.findById = jest.fn(() => Promise.resolve({
      id: 1,
      senha: 'senha123',
    }));

    await usuarioService.redefinirSenha(1, '123senha');

    expect(usuarioRepository.save).toHaveBeenCalledTimes(1);
    expect(usuarioRepository.save).toHaveBeenCalledWith({
      id: 1,
      senha: '123senha',
      primeiroAcessoRealizado: true,
    })
  })
});
