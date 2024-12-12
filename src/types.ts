export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    program?: {
      id: number;
      name: string;
    };
    department?: {
      id: number;
      name: string;
    };
    profilepic?: string;
    avaliacoes?: Avaliacao[];
  }
  
  export interface Avaliacao {
    id?: number;
    date?: string;
    text: string;
    professorId: number;
    courseId:number;
    userId: number;
    nota:number;
    comments?: Comment[];
    isEdited?: boolean;
}
  
export interface Comment {
    id?: number;
    text: string;
    userId: number;
    avaliacaoId: number;
    user?: {
      id: number;
      name: string;
    };
  }

export interface Professor {
    id: number;
    name: string;
    department: {
        id: number;
        name: string;
    };
    courses: {
        id: number;
        name: string;
    }[];
    createdAt: Date;
    profilepic?: string;
}