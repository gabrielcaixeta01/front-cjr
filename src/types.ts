export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  programId?: number;
  program?: {
    id: number;
    name: string;
  };
  departmentId?: number;
  department?: {
    id: number;
    name: string;
  };
  profilepic?: string;
  avaliacoes?: Avaliacao[]; // Avaliações feitas pelo usuário
}

export interface Comment {
  id: number;
  text: string;
  userId: number; // ID do autor do comentário
  user?: {
    id: number;
    name: string;
    profilepic?: string; // Foto do usuário que fez o comentário
  };
  avaliacaoId: number; // ID da avaliação associada
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Avaliacao {
  id: number;
  text: string;
  userId: number; // ID do autor da avaliação
  user?: User; // Dados do autor da avaliação
  professorId: number; // ID do professor
  professor?: Professor; // Dados do professor
  courseId: number; // ID do curso
  course?: Course; // Dados do curso
  comments?: Comment[]; // Comentários associados à avaliação
  isEdited?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Professor {
  id: number;
  name: string;
  departmentId?: number;
  department?: {
    id: number;
    name: string;
  };
  courses?: Course[]; // Cursos associados ao professor
  avaliacoes?: Avaliacao[]; // Avaliações feitas para o professor
  profilepic?: string;
  createdAt?: Date;
}

export interface Course {
  id: number;
  name: string;
  department?: {
    id: number;
    name: string;
  };
  professors?: Professor[]; // Professores associados ao curso
  avaliacoes?: Avaliacao[]; // Avaliações associadas ao curso
  createdAt?: Date;
}

export interface Department {
  id: number;
  name: string;
}

export interface Program {
  id: number;
  name: string;
}