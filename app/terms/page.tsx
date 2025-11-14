import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-4">Last updated: January 13, 2025</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using BuilderIQ ("Service"), you agree to be bound by these Terms of Service ("Terms").
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                BuilderIQ provides a builder intelligence platform that aggregates and displays information about new
                home builder incentives, quick-move-in inventory, and related real estate data. The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access to builder incentive data and inventory listings</li>
                <li>Search and filtering tools</li>
                <li>Marketing content generation tools</li>
                <li>Email alerts and notifications</li>
                <li>API access (for Enterprise plans)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">4. Subscription and Billing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some parts of the Service are billed on a subscription basis ("Subscription"). You will be billed in
                advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly or
                annual basis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At the end of each Billing Cycle, your Subscription will automatically renew unless you cancel it or
                BuilderIQ cancels it. You may cancel your Subscription renewal through your account settings or by
                contacting our support team.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">5. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Violate or infringe upon the rights of others</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Scrape, data mine, or use automated tools to access the Service without permission</li>
                <li>Resell or redistribute the Service or any data obtained from it</li>
                <li>Interfere with or disrupt the Service or servers</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">6. Data Accuracy</h2>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to provide accurate and up-to-date information, BuilderIQ does not guarantee the
                accuracy, completeness, or timeliness of any data displayed on the Service. Builder incentives and
                inventory are subject to change without notice. Users should verify all information directly with
                builders before making any decisions.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and functionality are owned by BuilderIQ and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or
                liability, for any reason, including breach of these Terms. Upon termination, your right to use the
                Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall BuilderIQ, its directors, employees, partners, agents, or affiliates be liable for any
                indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or
                goodwill, arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by
                email or through the Service. Your continued use of the Service after changes constitutes acceptance of
                the new Terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-accent/30 p-6 rounded-lg mt-4">
                <p className="text-foreground">
                  <strong>Email:</strong> legal@builderiq.com
                </p>
                <p className="text-foreground mt-2">
                  <strong>Address:</strong> BuilderIQ, Indianapolis, IN
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
