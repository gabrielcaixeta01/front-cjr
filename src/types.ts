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
  avaliacoes?: Avaliacao[];
}
  
  export interface Avaliacao {
    id?: number;
    date?: string;
    text: string;
    professorId: number;
    courseId:number;
    userId: number;
    comments?: Comment[];
    isEdited?: boolean;
}
  
export interface Comment {
    id?: number;
    text: string;
    user?: {
        id: number;
        name: string;
    };
    userId: number;
    avaliacaoId: number;
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