"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import {
  createUser,
  getUserByEmail,
} from "@/utils/api";
import { Department, Program, User } from "@/types";
import { toast } from "react-toastify";
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
      id: Yup.number()
        .required("Por favor, selecione um departamento")
        .min(1, "Selecione um departamento válido"),
    })
    .nullable(),
  program: Yup.object()
    .shape({
      id: Yup.number()
        .required("Por favor, selecione um curso")
        .min(1, "Selecione um curso válido"),
    })
    .nullable(),
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
      } catch {
        toast.error("Erro ao buscar professores.");
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("http://localhost:4000/programs"); // URL corrigida
        setPrograms(response.data as Program[]);
      } catch {
        toast.error("Erro ao buscar professores.");
      }
    };
    fetchPrograms();
  }, []);

  const onSubmit = async (values: User) => {
    if (!values.department?.id || !values.program?.id) {
      toast.error("Por favor, selecione o departamento e o curso.", {
        autoClose: 3000,
      });
      return;
    }
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
      await createUser(newUser);
      toast.success("Usuário criado com sucesso!", { autoClose: 3000 });
      router.push("/login");
    } catch {
      toast.error("Erro ao criar usuário", { autoClose: 3000 });
    }
  };

  return (
    <div className="w-full flex relative h-screen min-h-fit overflow-y-scroll">
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

              <select
                value={values.program?.id || ""}
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedProgram = programs.find(
                    (program) => program.id === parseInt(event.target.value)
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
              </select>
              <ErrorMessage
                name="program.id"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <select
                value={values.department?.id || ""}
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedDepartment = departments.find(
                    (department) =>
                      department.id === parseInt(event.target.value)
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
              </select>
              <ErrorMessage
                name="department.id"
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

              <section className="mt-16 flex space-x-8">
                <button
                  type="submit"
                  className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
                >
                  Criar Conta
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
                >
                  Fazer Login
                </button>
              </section>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
