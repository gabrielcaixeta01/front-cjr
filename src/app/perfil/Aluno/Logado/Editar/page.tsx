"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { api } from "@/utils/page";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validação usando Yup
const validationSchema = Yup.object({
  name: Yup.string(),
  password: Yup.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  department: Yup.string(),
  course: Yup.string(),
  profilePicture: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Formato inválido. Apenas imagens são permitidas.",
      (value) =>
        !value ||
        (value instanceof File &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    ),
});

// Valores iniciais do formulário
const initialValues = {
  name: "",
  password: "",
  department: "",
  course: "",
  profilePicture: null,
};

const EditarPerfil = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const onSubmit = async (
    values: typeof initialValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    const formData = new FormData();

    // Adiciona os valores do formulário ao FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string | Blob);
      }
    });

    try {
      const response = await api.put("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Dados enviados com sucesso:", response.data);
      toast.success("Perfil atualizado com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar o perfil. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await api.delete("/users/me"); // Substitua pela rota correta de exclusão do perfil
      toast.success("Perfil excluído com sucesso.");
      // Redirecionar ou limpar estado após exclusão
      setTimeout(() => {
        window.location.href = "/"; // Redireciona para a página inicial
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir o perfil:", error);
      toast.error("Erro ao excluir o perfil. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-row h-screen bg-gray-100 pt-32 justify-center p-6">
      {/* ToastContainer para exibir as mensagens */}
      <ToastContainer />

      <div className="bg-customGreen p-6 rounded-lg max-w-md max-h-fit shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-azulCjr">
            Atualize seu Perfil
          </h1>
          <p className="text-sm italic text-gray-600">
            Mantenha suas informações sempre atualizadas
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-4 text-black">
              {[
                { id: "name", label: "Nome", type: "text" },
                { id: "department", label: "Departamento", type: "text" },
                { id: "course", label: "Curso", type: "text" },
              ].map(({ id, label, type }) => (
                <div key={id} className="bg-white p-4 rounded-[30px] shadow-md">
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <Field
                    id={id}
                    name={id}
                    type={type}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                  />
                  <ErrorMessage
                    name={id}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}

              <div className="bg-white p-4 rounded-[30px] shadow-md relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <div className="flex items-center">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 block w-full border-0 border-b-2 border-gray-50 focus:outline-none focus:border-blue-400 focus:ring-0 transition duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-800 transition"
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[30px] justify-center shadow-md flex flex-col">
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Foto de Perfil
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      if (file) {
                        setFieldValue("profilePicture", file);
                        setSelectedFile(file.name);
                      } else {
                        setFieldValue("profilePicture", null);
                        setSelectedFile(null);
                      }
                    }}
                  />

                  <label
                    htmlFor="profilePicture"
                    className="bg-azulCjr text-white text-sm px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-300"
                  >
                    Escolher arquivo
                  </label>

                  <span className="ml-4 text-sm text-gray-600">
                    {selectedFile || "Nenhum arquivo selecionado"}
                  </span>
                </div>

                <ErrorMessage
                  name="profilePicture"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex items-center justify-around p-5">
                <button
                  className="bg-azulCjr font-semibold text-white px-7 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  onClick={() => history.back()}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-azulCjr font-semibold text-white px-7 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  {isSubmitting ? "Enviando..." : "Salvar"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="bg-red-500 ml-5 p-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
        <div className="text-center mb-6 p-2">
          <h1 className="text-3xl font-bold text-white mb-4">
            Excluir Perfil
          </h1>
          <p className="text-xs italic text-white">
            Tem certeza de que deseja excluir seu perfil? Sentiremos sua falta, mas respeitamos sua decisão. Lembre-se: esta ação não pode ser desfeita.
          </p>
        </div>
        <button
          onClick={handleDeleteProfile}
          className="bg-white text-black font-semibold px-7 py-2 rounded-lg hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default EditarPerfil;