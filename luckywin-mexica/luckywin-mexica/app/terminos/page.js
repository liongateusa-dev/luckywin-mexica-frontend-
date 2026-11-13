"use client";

import { useLanguage } from "../../lib/LanguageContext";

export default function TermsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">{t("legal.termsHeading")}</h1>
      {lang === "es" ? <TermsEs /> : <TermsEn />}
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

function TermsEs() {
  return (
    <div>
      <p className="text-neutral-400 text-sm mb-8">
        Última actualización: [FECHA]. Estos Términos y Condiciones rigen la
        participación en la promoción "LuckyWin Mexica" (la "Promoción"),
        operada por LuckyWin Mexica ("el Operador").
      </p>

      <Section title="1. Elegibilidad">
        <p>
          La Promoción está abierta únicamente a personas residentes en
          México que tengan 18 años de edad o más al momento de registrarse.
          Al registrarte, confirmas que cumples con estos requisitos. El
          Operador se reserva el derecho de solicitar comprobación de edad
          y residencia antes de la entrega de cualquier premio.
        </p>
      </Section>

      <Section title="2. Sin compra necesaria">
        <p>
          No se requiere compra, pago ni contraprestación de ningún tipo
          para participar ni para ganar. La participación es 100% gratuita.
        </p>
      </Section>

      <Section title="3. Cómo participar">
        <p>
          Cada persona puede registrarse una vez por ciclo promocional
          (mensual) utilizando un correo electrónico y número de teléfono
          válidos. Cada participante registrado recibe hasta dos (2)
          intentos por ciclo para conocer si resultó ganador. El sistema
          de selección es aleatorio y está sujeto a la disponibilidad de
          premios restantes en el ciclo vigente.
        </p>
      </Section>

      <Section title="4. Premios disponibles por ciclo">
        <p>El ciclo mensual actual incluye un total de 40 premios:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>5 premios en efectivo de $5,000 USD cada uno</li>
          <li>5 iPhone 17</li>
          <li>10 PlayStation 5</li>
          <li>10 laptops</li>
          <li>10 tarjetas de regalo Amazon de $1,000 USD cada una</li>
        </ul>
        <p>
          Las probabilidades de ganar dependen del número total de
          participantes en el ciclo frente a los 40 premios disponibles, y
          disminuyen conforme se agota el inventario de cada categoría de
          premio. El Operador no garantiza que todos los participantes
          ganarán un premio.
        </p>
      </Section>

      <Section title="5. Conversión de premios en efectivo (USD a MXN)">
        <p>
          Los premios en efectivo están denominados en dólares
          estadounidenses (USD), pero se pagarán en pesos mexicanos (MXN).
          La conversión se realizará al tipo de cambio de referencia
          publicado por el Banco de México (Banxico) vigente en la fecha
          en que se procese el pago al ganador. El monto final en pesos
          puede variar según el tipo de cambio aplicable en ese momento.
        </p>
      </Section>

      <Section title="6. Proceso de reclamación de premios">
        <p>
          Los ganadores serán notificados dentro de la plataforma al
          momento de resultar seleccionados y deberán contactar al
          Operador a través del número de WhatsApp oficial publicado en
          el sitio, proporcionando su número de entrada único, dentro de
          un plazo de siete (7) días naturales a partir de la notificación
          ("Plazo de Reclamación").
        </p>
        <p>
          El Operador podrá solicitar verificación de identidad, edad y
          domicilio antes de hacer entrega del premio. Las reclamaciones
          recibidas fuera del Plazo de Reclamación podrán ser declaradas
          vencidas, a criterio del Operador.
        </p>
      </Section>

      <Section title="7. Una entrada por persona">
        <p>
          Cada persona puede registrar únicamente una cuenta por ciclo,
          identificada por correo electrónico y número de teléfono. El
          Operador se reserva el derecho de descalificar entradas
          duplicadas, fraudulentas o que violen estos Términos.
        </p>
      </Section>

      <Section title="8. Modificación o cancelación de la Promoción">
        <p>
          El Operador se reserva el derecho de modificar, suspender o
          cancelar la Promoción, así como de ajustar el número de premios
          disponibles o las probabilidades de ganar, en cualquier momento
          y sin previo aviso, siempre que dicho cambio no afecte
          negativamente a los ganadores ya determinados.
        </p>
      </Section>

      <Section title="9. Uso de datos personales">
        <p>
          Los datos proporcionados durante el registro se utilizan
          exclusivamente para administrar la Promoción y contactar a los
          ganadores. Consulta nuestra Política de Privacidad para más
          detalles.
        </p>
      </Section>

      <Section title="10. Válido donde la ley lo permita">
        <p>
          Esta Promoción no está disponible en jurisdicciones donde esté
          prohibida o restringida por ley. Es responsabilidad del
          participante verificar que su participación sea legal en su
          lugar de residencia.
        </p>
      </Section>

      <Section title="11. Contacto">
        <p>
          Para dudas sobre estos Términos, contáctanos a través del
          WhatsApp oficial publicado en el sitio.
        </p>
      </Section>
    </div>
  );
}

function TermsEn() {
  return (
    <div>
      <p className="text-neutral-400 text-sm mb-8">
        Last updated: [DATE]. These Terms and Conditions govern
        participation in the "LuckyWin Mexica" promotion (the
        "Promotion"), operated by LuckyWin Mexica (the "Operator").
      </p>

      <Section title="1. Eligibility">
        <p>
          The Promotion is open only to Mexico residents who are 18 years
          of age or older at the time of registration. By registering,
          you confirm you meet these requirements. The Operator reserves
          the right to request proof of age and residency before
          delivering any prize.
        </p>
      </Section>

      <Section title="2. No purchase necessary">
        <p>
          No purchase, payment, or consideration of any kind is required
          to enter or win. Participation is 100% free.
        </p>
      </Section>

      <Section title="3. How to enter">
        <p>
          Each person may register once per promotional cycle (monthly)
          using a valid email and phone number. Each registered entrant
          receives up to two (2) attempts per cycle to find out if they
          won. Selection is random and subject to the availability of
          remaining prizes in the current cycle.
        </p>
      </Section>

      <Section title="4. Prizes available per cycle">
        <p>The current monthly cycle includes a total of 40 prizes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>5 cash prizes of $5,000 USD each</li>
          <li>5 iPhone 17 units</li>
          <li>10 PlayStation 5 units</li>
          <li>10 laptops</li>
          <li>10 Amazon gift cards of $1,000 USD each</li>
        </ul>
        <p>
          Odds of winning depend on the total number of entrants in the
          cycle relative to the 40 available prizes, and decrease as each
          prize tier's inventory is depleted. The Operator does not
          guarantee that every entrant will win a prize.
        </p>
      </Section>

      <Section title="5. Cash prize conversion (USD to MXN)">
        <p>
          Cash prizes are denominated in U.S. dollars (USD) but will be
          paid out in Mexican pesos (MXN). Conversion will use the
          reference exchange rate published by Banco de México (Banxico)
          in effect on the date the winner's payment is processed. The
          final peso amount may vary based on the applicable exchange
          rate at that time.
        </p>
      </Section>

      <Section title="6. Prize claim process">
        <p>
          Winners will be notified within the platform at the moment
          they are selected and must contact the Operator via the
          official WhatsApp number published on the site, providing
          their unique entry number, within seven (7) calendar days of
          notification (the "Claim Period").
        </p>
        <p>
          The Operator may request identity, age, and address
          verification before delivering the prize. Claims received
          after the Claim Period may be declared forfeited at the
          Operator's discretion.
        </p>
      </Section>

      <Section title="7. One entry per person">
        <p>
          Each person may register only one account per cycle, identified
          by email and phone number. The Operator reserves the right to
          disqualify duplicate, fraudulent, or otherwise non-compliant
          entries.
        </p>
      </Section>

      <Section title="8. Modification or cancellation of the Promotion">
        <p>
          The Operator reserves the right to modify, suspend, or cancel
          the Promotion, and to adjust the number of available prizes or
          odds of winning, at any time and without prior notice, provided
          such change does not negatively affect already-determined
          winners.
        </p>
      </Section>

      <Section title="9. Use of personal data">
        <p>
          Data provided during registration is used solely to administer
          the Promotion and contact winners. See our Privacy Policy for
          details.
        </p>
      </Section>

      <Section title="10. Void where prohibited">
        <p>
          This Promotion is not available in jurisdictions where it is
          prohibited or restricted by law. It is the entrant's
          responsibility to confirm that participation is legal in their
          place of residence.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For questions about these Terms, contact us via the official
          WhatsApp number published on the site.
        </p>
      </Section>
    </div>
  );
}
