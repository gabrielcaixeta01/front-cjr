"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRef } from "react";

const validationSchema = Yup.object({
  name: Yup.string().required("Insira o seu nome"),
  email: Yup.string()
    .email("Insira um email válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
  department: Yup.string().required("O departamento é obrigatório"),
  course: Yup.string().required("O curso é obrigatório"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  department: "",
  course: "",
};

export default function Cadastro() {
  const referencia_imagem = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const onSubmit = (values: typeof initialValues) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== "")
    );
    console.log("Dados salvos:", filteredValues);
    router.push("/feed/Logado");
  };
  //const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full h-screen flex  relative">
      <div className="ImgContainer flex justify-center h-full flex-1 relative">
        <div className="absolute w-full h-screen bg-black/30 z-30">
          
        </div>
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
          className="mt-4 rounded-full"
          onClick={() => referencia_imagem.current?.click()}
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form className="w-3/4 flex flex-col items-center">
              <Field
                name="name"
                type="text"
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-16 "
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
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
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
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
                placeholder="Senha"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <Field
                name="course"
                type="text"
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
                placeholder="Curso"
              />
              <ErrorMessage
                name="course"
                component="div"
                className="text-red-500 text-sm mt-2"
              />

              <Field
                name="department"
                type="text"
                className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
                placeholder="Departamento"
              />
              <ErrorMessage
                name="department"
                component="div"
                className="text-red-500 text-sm mt-2"
              />



              <section className="mt-16">
                <button
                  type="submit"
                  className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl"
                >
                  Criar Conta
                </button>
              </section>
            </Form>
          )}
        </Formik>
        <input type="file" className="hidden" ref={referencia_imagem}>
        
        </input>
      </div>
    </div>
  );
}
//616 x 750
