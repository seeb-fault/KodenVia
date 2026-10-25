import { db } from "@/db/client";
import { faqs } from "@/db/schema";
import { createFaq, updateFaq, deleteFaq } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { type AdminField } from "@/components/admin/RecordFormDialog";

export const dynamic = "force-dynamic";

const fields: AdminField[] = [
  {
    name: "question",
    label: "Pregunta",
    type: "text",
    placeholder: "¿Qué servicios ofrece Kodenvia?",
    required: true,
  },
  {
    name: "answer",
    label: "Respuesta",
    type: "textarea",
    rows: 4,
    placeholder: "Una respuesta clara y breve.",
    required: true,
  },
  { name: "order", label: "Orden", type: "number" },
];

function parse(formData: FormData) {
  return {
    question: String(formData.get("question")),
    answer: String(formData.get("answer")),
    order: Number(formData.get("order") || 0),
  };
}

export default async function FaqsEditor() {
  const rows = await db.select().from(faqs).orderBy(faqs.order);

  async function create(formData: FormData) {
    "use server";
    await createFaq(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateFaq(Number(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteFaq(Number(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Preguntas frecuentes"
      description="Respuestas a las preguntas más comunes sobre Kodenvia."
      createTitle="Añadir pregunta"
      editTitle="Editar pregunta"
      fields={fields}
      rows={rows}
      toRow={(f) => ({
        primary: f.question,
        meta: f.answer,
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay preguntas frecuentes."
    />
  );
}
