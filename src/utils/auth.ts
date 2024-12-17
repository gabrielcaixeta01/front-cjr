export const getUserIdFromSession = async (): Promise<number> => {
    // Simulação de um ID obtido do token JWT, cookie ou sessão
    return new Promise((resolve) => {
      setTimeout(() => resolve(2), 1000); // Retorna o ID 2 como exemplo
    });
  };