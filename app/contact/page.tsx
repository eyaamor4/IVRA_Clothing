"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clock,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Shield,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue. Réessayez.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    } catch {
      setError("Impossible d'envoyer le message. Vérifiez votre connexion.");
      setIsSubmitting(false);
    }
  };

    const contactInfo = [
    {
      icon: Mail,
      title: "Par email",
      details: ["ivraclothing@gmail.com"],
      description: "Nous répondons sous 24h",
    },
    {
      icon: Phone,
      title: "Par téléphone",
      details: ["+216 28 733 815"],
      description: "Du lundi au samedi, 9h - 18h",
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Tunis, Tunisie"],
      description: "Livraison partout en Tunisie",
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lundi - Samedi : 9h - 18h"],
      description: "Dimanche : fermé",
    },
  ];

  const features = [
    {
      icon: Headphones,
      title: "Support réactif",
      description: "Une question ? On vous répond rapidement",
    },
    {
      icon: MessageSquare,
      title: "Réponse sous 24h",
      description: "Par email ou téléphone",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "Vous payez en espèces à la livraison, sans risque",
    },
  ];

  return (
    <div className="bg-background">
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
                   <Badge className="mb-6 bg-primary text-primary-foreground">
              Contactez-nous
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Nous serions ravis de{" "}
              <span className="text-primary block lg:inline lg:ml-4">
                vous entendre
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une question, une suggestion, ou juste envie de nous dire
              bonjour ? Nous sommes là pour vous aider.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                                <CardTitle className="text-2xl font-bold text-foreground">
                    Envoyez-nous un message
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Remplissez le formulaire ci-dessous, nous vous répondrons
                    dès que possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-background border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Your Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-foreground"
                      >
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your question or concern..."
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border resize-none"
                      />
                    </div>

                                      {error && (
                      <p className="text-sm text-destructive font-medium">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isSubmitted}
                      className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Envoi en cours...
                        </div>
                      ) : isSubmitted ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Message envoyé !
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Envoyer le message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Informations de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-muted-foreground"
                          >
                            {detail}
                          </p>
                        ))}
                        <p className="text-xs text-muted-foreground mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Pourquoi nous contacter ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-accent/10 rounded">
                          <feature.icon className="h-4 w-4 text-accent-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      {index < features.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6">
              FAQ
            </Badge>
                       <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez rapidement des réponses aux questions les plus posées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                       {[
              {
                question: "Comment se passe la livraison ?",
                answer:
                  "Nous livrons à domicile partout en Tunisie. Vous payez en espèces directement au livreur à la réception de votre commande.",
              },
              {
                question: "Combien de temps prend la livraison ?",
                answer:
                  "En général entre 2 et 5 jours ouvrés selon votre ville, après confirmation de votre commande par téléphone.",
              },
              {
                question: "Puis-je changer ou annuler ma commande ?",
                answer:
                  "Oui, contactez-nous par téléphone ou email avant l'expédition et nous ajusterons votre commande sans problème.",
              },
              {
                question: "Comment vous contacter rapidement ?",
                answer:
                  "Le plus rapide est de nous appeler au +216 28 733 815, ou de nous écrire à ivraclothing@gmail.com.",
              },
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12 text-center">
                           <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Une autre question ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                N&apos;hésitez pas, notre équipe est là pour vous aider.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a href="tel:+21628733815">
                    <Phone className="h-4 w-4 mr-2" />
                    Appelez-nous
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <a href="mailto:ivraclothing@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
