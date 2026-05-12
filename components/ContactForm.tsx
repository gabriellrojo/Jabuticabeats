"use client"

import { useState } from "react"
import { z } from "zod"

import { Form } from "@/components/ui/form"

const contactSchema = z.object({
  name: z.string().min(1, "Informe seu nome."),
  phone: z
    .string()
    .min(12, "Informe seu telefone completo.")
    .regex(/^\(\d{2}\)\d{9}$/, "Informe seu telefone"),
  email: z
    .string()
    .min(1, "Informe seu email.")
    .email("Informe um email válido."),
  message: z.string().min(1, "Escreva sua mensagem."),
})

type ContactFormData = z.infer<typeof contactSchema>

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11)

  if (numbers.length <= 2) {
    return numbers
  }

  return `(${numbers.slice(0, 2)})${numbers.slice(2)}`
}

export function ContactForm() {
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({})

  const [success, setSuccess] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const values: ContactFormData = {
      name: String(formData.get("name") || "").trim(),
      phone,
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    }

    const result = contactSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {}

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactFormData

        if (field) {
          fieldErrors[field] = issue.message
        }
      })

      setErrors(fieldErrors)
      setSuccess(false)
      return
    }

    setErrors({})
    setSuccess(true)

    console.log("Form enviado:", result.data)
  }

  return (
    <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-md md:p-8">
      <Form onSubmit={handleSubmit} className="text-left">
        <div className="flex flex-col items-start gap-2 text-left">
          <label
            htmlFor="name"
            className="w-full text-left text-sm font-medium uppercase tracking-[0.2em] text-white/70"
          >
            Nome
          </label>

          <input
            id="name"
            name="name"
            placeholder="Seu nome"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-left text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
          />

          {errors.name && (
            <span className="block w-full text-left text-sm text-purple-300">
              {errors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 text-left">
          <label
            htmlFor="phone"
            className="w-full text-left text-sm font-medium uppercase tracking-[0.2em] text-white/70"
          >
            Telefone
          </label>

          <input
            id="phone"
            name="phone"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(formatPhone(event.target.value))
            }}
            placeholder="(11)111111111"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-left text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
          />

          {errors.phone && (
            <span className="block w-full text-left text-sm text-purple-300">
              {errors.phone}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 text-left">
          <label
            htmlFor="email"
            className="w-full text-left text-sm font-medium uppercase tracking-[0.2em] text-white/70"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-left text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
          />

          {errors.email && (
            <span className="block w-full text-left text-sm text-purple-300">
              {errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 text-left">
          <label
            htmlFor="message"
            className="w-full text-left text-sm font-medium uppercase tracking-[0.2em] text-white/70"
          >
            Mensagem
          </label>

          <textarea
            id="message"
            name="message"
            placeholder="Fale sobre seu projeto"
            className="min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
          />

          {errors.message && (
            <span className="block w-full text-left text-sm text-purple-300">
              {errors.message}
            </span>
          )}
        </div>

        {success && (
          <span className="block w-full text-left text-sm text-white/70">
            Mensagem validada com sucesso.
          </span>
        )}

        <button
          type="submit"
          className="cursor-pointer mt-2 inline-flex h-12 items-center justify-center rounded-2xl border border-purple-400/40 bg-purple-500/20 px-6 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-purple-500/30"
        >
          Enviar
        </button>
      </Form>
    </div>
  )
}