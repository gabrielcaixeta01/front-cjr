export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    program?: {
      id: number;
      name: string;
    };
    profilepic?: string;
    avaliacoes?: Avaliacao[];
  }
  
  export interface Avaliacao {
    id: number;
    date: string;
    professor: {
        name: string;
    };
    course: {
        id: number;
        name: string;
    };
    text: string;
    comments?: Comment[];
}
  
export interface Comment {
    id: number;
    text: string;
    user: {
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
}