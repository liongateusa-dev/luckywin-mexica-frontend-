"use client";

import { useLanguage } from "../../lib/LanguageContext";

export default function PrivacyPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">{t("legal.privacyHeading")}</h1>
      {lang === "es" ? <PrivacyEs /> : <PrivacyEn />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gold mb-2">{title}</h2>
      <div className="text-neutral-300 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

function PrivacyEs() {
  return (
    <div>
      <p className="text-neutral-400 text-sm mb-8">
        Última actualización: [FECHA]. Esta Política de Privacidad describe
        cómo LuckyWin Mexica ("nosotros") recopila, usa y protege tu
        información personal.
      </p>

      <Section title="1. Datos que recopilamos">
        <p>
          Recopilamos el nombre completo, correo electrónico y número de
          teléfono que proporcionas al registrarte, así como tu dirección
          IP con fines de prevención de fraude.
        </p>
      </Section>

      <Section title="2. Uso de tus datos">
        <p>Usamos tus datos únicamente para:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Registrar tu participación en la promoción</li>
          <li>Asignar tu número de entrada y gestionar tus intentos</li>
          <li>Contactarte en caso de resultar ganador</li>
          <li>Prevenir entradas duplicadas o fraudulentas</li>
        </ul>
      </Section>

      <Section title="3. No vendemos tus datos">
        <p>
          No vendemos, alquilamos ni compartimos tu información personal
          con terceros con fines de mercadotecnia.
        </p>
      </Section>

      <Section title="4. Conservación de datos">
        <p>
          Conservamos tus datos durante el tiempo necesario para
          administrar el ciclo promocional vigente y, en caso de resultar
          ganador, durante el tiempo requerido para procesar la entrega
          del premio y mantener un registro en caso de disputa.
        </p>
      </Section>

      <Section title="5. Tus derechos">
        <p>
          Puedes solicitar acceso, corrección o eliminación de tus datos
          personales contactándonos a través del WhatsApp oficial
          publicado en el sitio.
        </p>
      </Section>

      <Section title="6. Contacto">
        <p>
          Para preguntas sobre esta Política de Privacidad, contáctanos a
          través del WhatsApp oficial publicado en el sitio.
        </p>
      </Section>
    </div>
  );
}

function PrivacyEn() {
  return (
    <div>
      <p className="text-neutral-400 text-sm mb-8">
        Last updated: [DATE]. This Privacy Policy describes how LuckyWin
        Mexica ("we") collects, uses, and protects your personal
        information.
      </p>

      <Section title="1. Data we collect">
        <p>
          We collect the full name, email address, and phone number you
          provide when registering, as well as your IP address for fraud
          prevention purposes.
        </p>
      </Section>

      <Section title="2. How we use your data">
        <p>We use your data solely to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Register your participation in the promotion</li>
          <li>Assign your entry number and manage your attempts</li>
          <li>Contact you if you win</li>
          <li>Prevent duplicate or fraudulent entries</li>
        </ul>
      </Section>

      <Section title="3. We do not sell your data">
        <p>
          We do not sell, rent, or share your personal information with
          third parties for marketing purposes.
        </p>
      </Section>

      <Section title="4. Data retention">
        <p>
          We retain your data for as long as necessary to administer the
          current promotional cycle, and, if you win, for as long as
          needed to process prize delivery and maintain a record in case
          of dispute.
        </p>
      </Section>

      <Section title="5. Your rights">
        <p>
          You may request access to, correction of, or deletion of your
          personal data by contacting us via the official WhatsApp number
          published on the site.
        </p>
      </Section>

      <Section title="6. Contact">
        <p>
          For questions about this Privacy Policy, contact us via the
          official WhatsApp number published on the site.
        </p>
      </Section>
    </div>
  );
}
