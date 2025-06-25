'use client'

import { Plus, Mic, ArrowRight, Image as ImageIcon, FileText, Code } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const suggestionCards = [
    {
        label: "Imagem",
        title: "Um avião decolando na pista com um lindo nascer do sol",
        image: "https://placehold.co/600x400.png",
        hint: "airplane sunrise"
    },
    {
        label: "Texto",
        title: "Um post de blog sobre como cuidar de plantas...",
        image: "https://placehold.co/600x400.png",
        hint: "plant care"
    },
    {
        label: "Programação",
        title: "Uma calculadora de preços interativa para compartilhar...",
        image: "https://placehold.co/600x400.png",
        hint: "code calculator"
    },
    {
        label: "Texto",
        title: "Um artigo de blog sobre tendências em moda...",
        image: "https://placehold.co/600x400.png",
        hint: "fashion trends"
    },
    {
        label: "Programação",
        title: "Uma linha do tempo histórica interativa",
        image: "https://placehold.co/600x400.png",
        hint: "timeline code"
    },
    {
        label: "Imagem",
        title: "Um frasco simples de produto para cuidado da pele...",
        image: "https://placehold.co/600x400.png",
        hint: "skincare product"
    },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center gap-8 px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-4xl text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
          O que você vai criar hoje?
        </h1>
        <div className="flex justify-center">
            <Tabs defaultValue="ia" className="w-auto">
              <TabsList>
                <TabsTrigger value="designs">Seus designs</TabsTrigger>
                <TabsTrigger value="modelos">Modelos</TabsTrigger>
                <TabsTrigger value="ia">Canva IA</TabsTrigger>
              </TabsList>
            </Tabs>
        </div>
      </div>

      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardContent className="p-4 flex items-start gap-4">
          <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
          <div className="flex-grow">
            <Textarea
              placeholder="Descreva sua ideia e eu vou dar vida a ela"
              className="bg-transparent border-0 resize-none focus-visible:ring-0 text-base min-h-[60px]"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="h-5 w-5" />
            </Button>
             <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            <ImageIcon className="mr-2 h-4 w-4" /> Gerar uma imagem
          </Button>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            <FileText className="mr-2 h-4 w-4" /> Escrever um doc
          </Button>
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
            <Code className="mr-2 h-4 w-4" /> Programar
          </Button>
      </div>
      
      <div className="w-full max-w-6xl space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Veja o que você pode fazer com a IA</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestionCards.map((card, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer border hover:shadow-lg transition-shadow duration-300 rounded-xl">
                 <CardContent className="p-4 space-y-2">
                    <span className={`text-sm font-semibold ${
                        card.label === 'Imagem' ? 'text-blue-600' :
                        card.label === 'Texto' ? 'text-green-600' : 'text-purple-600'
                    }`}>{card.label}</span>
                    <p className="text-gray-600 text-base">{card.title}</p>
                    <div className="aspect-[3/2] w-full relative overflow-hidden rounded-lg mt-2">
                        <Image src={card.image} alt={card.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={card.hint} />
                    </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
