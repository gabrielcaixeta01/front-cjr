"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("O nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
});

const initialValues = {
  name: "",
  email: "",
};

const onSubmit = (values: { name: string; email: string }) => {
  console.log("Dados enviados:", values);
};

export default function EditarPerfil() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Editar Perfil</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="name">Nome</label>
              <Field
                id="name"
                name="name"
                type="text"
                className="border p-2 rounded w-full"
              />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="email">E-mail</label>
              <Field
                id="email"
                name="email"
                type="email"
                className="border p-2 rounded w-full"
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Enviando..." : "Salvar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}