"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import {
  getAllDepartments,
  getAllPrograms,
  createUser,
  getUserByEmail,
} from "@/utils/api";
import { Department, Program, User } from "@/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const validationSchema = Yup.object({
  name: Yup.string().required("Insira o seu nome"),
  email: Yup.string()
    .email("Insira um email válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "A senha deve conter pelo menos um caractere especial"
    )
    .required("A senha é obrigatória"),
  department: Yup.object()
    .shape({
      id: Yup.number().required("O departamento é obrigatório").positive(),
      name: Yup.string().required("O nome do departamento é obrigatório"),
    })
    .required("O departamento é obrigatório"),
  program: Yup.object()
    .shape({
      id: Yup.number().required("O curso é obrigatório").positive(),
      name: Yup.string().required("O nome do curso é obrigatório"),
    })
    .required("O curso é obrigatório"),
  profilepic: Yup.mixed().nullable(),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  department: { id: 0, name: "" },
  program: { id: 0, name: "" },
  profilepic: undefined,
};

export default function Cadastro() {
  const referencia_imagem = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/departments"); // URL corrigida
        setDepartments(response.data as Department[]);
      } catch (error) {
        toast.error("Erro ao buscar professores.");
        console.error("Erro ao buscar professores:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://localhost:4000/programs"); // URL corrigida
        setPrograms(response.data as Program[]);
      } catch (error) {
        toast.error("Erro ao buscar professores.");
        console.error("Erro ao buscar professores:", error);
      }
    };
    fetchPrograms();
  }, []);

  const onSubmit = async (values: User) => {
    const existingUser: User | null = await getUserByEmail(values.email);
    if (existingUser) {
      toast.error("Este e-mail já está cadastrado.", { autoClose: 3000 });
      return; 
    }
    const newUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      programId: values.program?.id || undefined,
      departmentId: values.department?.id || undefined,
      profilepic: values.profilepic || undefined,
    };

    try {
      const response = await createUser(newUser);
      console.log("Usuário criado:", response);
      toast.success("Usuário criado com sucesso!", { autoClose: 3000 });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
      toast.error("Erro ao criar usuário", { autoClose: 3000 });
    }
  };

  return (
    <div className="w-full h-screen flex relative">
      <div className="ImgContainer flex justify-center h-full flex-1 relative">
        <div className="absolute w-full h-screen bg-black/30 z-30"></div>
        <Image
          src="/background-login.png"
          alt="Imagem de background da parte esquerda"
          layout="fill"
        />
        <div className="absolute top-8 text-7xl font-mono font-bold text-white z-50">
          <h1>Cadastro</h1>
          <h1 className="ml-4">Usuário</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-gray-100">
        <Image
          src="/default-profile.png"
          alt="Imagem padrão"
          width={150}
          height={150}
          className="mt-4 rounded-full cursor-pointer"
          onClick={() => referencia_imagem.current?.click()}
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="w-3/4 flex flex-col items-center">
              <Field
                name="name"
                type="text"
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-16 text-black"
                placeholder="Nome"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <Field
                name="email"
                type="text"
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <Field
                name="password"
                type="password"
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
                placeholder="Senha"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <Field
                as="select"
                name="program"
                value={values.program?.id || ""}
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedProgram = programs.find(
                    (program) => program.id === parseInt(e.target.value)
                  );
                  setFieldValue(
                    "program",
                    selectedProgram || { id: 0, name: "" }
                  );
                }}
              >
                <option value="" disabled>
                  Selecione o curso
                </option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="program"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <Field
                as="select"
                name="department"
                value={values.department?.id || ""}
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedDepartment = departments.find(
                    (department) => department.id === parseInt(e.target.value)
                  );
                  setFieldValue(
                    "department",
                    selectedDepartment || { id: 0, name: "" }
                  );
                }}
              >
                <option value="" disabled>
                  Selecione o departamento
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="department"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <input
                type="file"
                className="hidden"
                ref={referencia_imagem}
                onChange={(e) => {
                  if (e.target.files) {
                    setFieldValue("profilepic", e.target.files[0]);
                  }
                }}
              />

              <section className="mt-16">
                <button
                  type="submit"
                  className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
                >
                  Criar Conta
                </button>
              </section>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
