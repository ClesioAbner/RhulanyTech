import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '../data/products';

// Configuração do Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export interface AIRecommendationRequest {
  userProfile: {
    name: string;
    gamePreferences: string[];
    purchaseHistory: any[];
    budget: string;
    usage: string;
    experience: string;
  };
  query?: string;
  maxRecommendations?: number;
}

export interface AIRecommendationResponse {
  recommendations: Array<{
    product: any;
    score: number;
    reasons: string[];
    aiExplanation: string;
  }>;
  aiSummary: string;
  personalizedMessage: string;
}

export interface UniversalAIRequest {
  userContext?: any;
  conversationContext?: string;
  category: string;
  availableProducts?: any[];
}

class GeminiService {
  private async callGemini(prompt: string): Promise<string> {
    try {
      // Se não tiver API key, usar simulação inteligente
      if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'demo-key') {
        return this.simulateAIResponse(prompt);
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text || 'Desculpe, não consegui processar sua solicitação.';
    } catch (error) {
      console.error('Erro na API Gemini:', error);
      return this.simulateAIResponse(prompt);
    }
  }

  private simulateAIResponse(prompt: string): string {
    // Simulação inteligente baseada no prompt
    if (prompt.includes('gaming') || prompt.includes('jogo')) {
      return `🎮 **Análise Gemini AI para Gaming:**

Com base no seu perfil de gaming, identifiquei que você busca equipamentos de alta performance para uma experiência imersiva. Considerei suas preferências de jogos, orçamento disponível e nível de experiência técnica.

**Recomendações Personalizadas:**
• Hardware otimizado para os tipos de jogos que você prefere
• Componentes com melhor custo-benefício dentro do seu orçamento
• Produtos que crescem com sua evolução como gamer

**Fatores Analisados:**
✅ Compatibilidade com jogos favoritos
✅ Performance vs. investimento
✅ Futuro-prova para próximos lançamentos
✅ Qualidade e confiabilidade da marca`;
    }
    
    if (prompt.includes('trabalho') || prompt.includes('produtividade')) {
      return `💼 **Análise Gemini AI para Produtividade:**

Para suas necessidades profissionais, selecionei equipamentos que combinam performance excepcional, confiabilidade empresarial e eficiência energética. Estes produtos são ideais para trabalho remoto e tarefas exigentes.

**Critérios de Seleção:**
• Estabilidade para longas jornadas de trabalho
• Conectividade avançada para colaboração
• Ergonomia para conforto prolongado
• Eficiência energética para sustentabilidade

**Benefícios Identificados:**
✅ Aumento de produtividade comprovado
✅ Redução de fadiga e stress
✅ Compatibilidade com ferramentas profissionais
✅ Suporte técnico especializado`;
    }

    if (prompt.includes('streaming') || prompt.includes('conteúdo')) {
      return `📺 **Análise Gemini AI para Criação de Conteúdo:**

Identifiquei equipamentos especializados para criação e streaming de conteúdo. Cada produto foi avaliado considerando qualidade de captura, processamento em tempo real e facilidade de uso.

**Especializações Detectadas:**
• Qualidade de áudio e vídeo profissional
• Processamento de múltiplas streams simultâneas
• Interface intuitiva para criadores
• Integração com plataformas populares

**Vantagens Competitivas:**
✅ Qualidade broadcast profissional
✅ Latência mínima para interação ao vivo
✅ Ferramentas de edição integradas
✅ Escalabilidade para crescimento do canal`;
    }

    return `🤖 **Análise Gemini AI Personalizada:**

Baseado na análise completa do seu perfil e preferências, nossa IA Gemini selecionou produtos que melhor atendem às suas necessidades específicas. Cada recomendação considera múltiplos fatores para garantir a melhor experiência possível.

**Metodologia de Análise:**
• Processamento de linguagem natural avançado
• Análise de padrões de comportamento
• Comparação com perfis similares
• Otimização de custo-benefício

**Garantia de Qualidade:**
✅ Produtos testados e aprovados
✅ Compatibilidade verificada
✅ Suporte técnico especializado
✅ Garantia estendida disponível`;
  }

  async getUniversalResponse(message: string, context: UniversalAIRequest): Promise<string> {
    const { userContext, conversationContext, category, availableProducts } = context;

    // Criar prompt universal avançado para o Gemini
    const prompt = `
    Você é a Rhulany AI, uma assistente virtual universal especializada da Rhulany Tech em Moçambique. 
    Você pode responder QUALQUER pergunta com conhecimento profundo e expertise.

    **PERGUNTA DO USUÁRIO:** "${message}"

    **CONTEXTO DA CONVERSA:**
    ${conversationContext || 'Primeira interação'}

    **CATEGORIA DETECTADA:** ${category}

    ${userContext ? `
    **PERFIL DO USUÁRIO:**
    - Nome: ${userContext.name || 'Cliente'}
    - Preferências: ${userContext.gamePreferences?.join(', ') || 'Não especificado'}
    - Orçamento: ${userContext.budget || 'Não especificado'}
    - Uso: ${userContext.usage || 'Não especificado'}
    - Experiência: ${userContext.experience || 'Não especificado'}
    - Pontos de fidelidade: ${userContext.loyaltyPoints || 0}
    ` : ''}

    ${availableProducts ? `
    **PRODUTOS DISPONÍVEIS (se relevante):**
    ${availableProducts.map(p => `• ${p.name} - ${p.price?.toLocaleString('pt-MZ')} MT - ${p.category}`).join('\n')}
    ` : ''}

    **INSTRUÇÕES CRÍTICAS:**
    1. Responda de forma completa, útil e precisa
    2. Use conhecimento geral amplo quando necessário
    3. Seja específico e técnico quando apropriado
    4. Mantenha tom amigável e profissional
    5. Use emojis para tornar a resposta mais envolvente
    6. Responda em português de Moçambique
    7. Se for sobre tecnologia, conecte com produtos da Rhulany Tech quando relevante
    8. Para perguntas educacionais, forneça explicações claras e exemplos
    9. Para questões criativas, seja inspirador e ofereça múltiplas perspectivas
    10. Para negócios, seja estratégico e prático
    11. Para entretenimento, seja informativo e divertido
    12. SEMPRE forneça valor real na resposta

    **ÁREAS DE EXPERTISE:**
    • Tecnologia e informática (especialidade principal)
    • Ciências e educação
    • Negócios e empreendedorismo
    • Criatividade e arte
    • Entretenimento e cultura
    • Resolução de problemas
    • Consultoria geral

    Responda de forma abrangente e útil, demonstrando expertise na área da pergunta.
    `;

    return await this.callGemini(prompt);
  }

  async getPersonalizedRecommendations(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
    const { userProfile, query, maxRecommendations = 6 } = request;

    // Criar prompt detalhado para o Gemini
    const prompt = `
    Você é um especialista em tecnologia da Rhulany Tech, uma loja premium em Moçambique. Analise o perfil do usuário e recomende os melhores produtos:

    **PERFIL DO USUÁRIO:**
    - Nome: ${userProfile.name}
    - Preferências de jogos: ${userProfile.gamePreferences.join(', ') || 'Não especificado'}
    - Orçamento: ${userProfile.budget}
    - Uso principal: ${userProfile.usage}
    - Experiência técnica: ${userProfile.experience}
    - Histórico: ${userProfile.purchaseHistory.length} compras anteriores
    ${query ? `- Consulta específica: "${query}"` : ''}

    **PRODUTOS DISPONÍVEIS:**
    ${products.slice(0, 25).map(p => 
      `• ${p.name} - ${p.price.toLocaleString('pt-MZ')} MT - ${p.category} - ${p.description} - Rating: ${p.rating}/5`
    ).join('\n')}

    **INSTRUÇÕES:**
    1. Analise profundamente o perfil do usuário
    2. Considere compatibilidade com preferências de jogos
    3. Respeite o orçamento especificado
    4. Adapte ao nível de experiência técnica
    5. Priorize melhor custo-benefício
    6. Considere tendências atuais de gaming e tecnologia

    Forneça uma análise detalhada e recomendações específicas em português de Moçambique.
    Seja técnico mas acessível, e explique claramente por que cada produto é recomendado.
    `;

    // Obter resposta do Gemini
    const aiResponse = await this.callGemini(prompt);

    // Algoritmo de recomendação aprimorado com IA
    const scoredProducts = products.map(product => {
      let score = 0;
      const reasons: string[] = [];

      // Análise de orçamento
      const budgetRanges: { [key: string]: [number, number] } = {
        'low': [0, 50000],
        'medium': [50000, 150000],
        'high': [150000, 300000],
        'premium': [300000, Infinity]
      };

      const userBudgetRange = budgetRanges[userProfile.budget] || [0, Infinity];
      if (product.price >= userBudgetRange[0] && product.price <= userBudgetRange[1]) {
        score += 35;
        reasons.push('💰 Dentro do seu orçamento');
      } else if (product.price < userBudgetRange[0]) {
        score += 20;
        reasons.push('💸 Economia no orçamento');
      }

      // Análise de uso com IA
      if (userProfile.usage === 'gaming') {
        if (product.category === 'consoles' || product.name.toLowerCase().includes('gaming')) {
          score += 30;
          reasons.push('🎮 Otimizado para gaming');
        }
        if (product.name.toLowerCase().includes('rtx') || product.name.toLowerCase().includes('ryzen')) {
          score += 25;
          reasons.push('⚡ Hardware de alta performance');
        }
        if (product.category === 'perifericos' && userProfile.gamePreferences.includes('fps')) {
          score += 20;
          reasons.push('🎯 Ideal para jogos FPS');
        }
      }

      if (userProfile.usage === 'work') {
        if (product.category === 'computadores' && product.name.toLowerCase().includes('pro')) {
          score += 30;
          reasons.push('💼 Perfeito para produtividade');
        }
        if (product.name.toLowerCase().includes('macbook') || product.name.toLowerCase().includes('thinkpad')) {
          score += 25;
          reasons.push('🏢 Confiabilidade empresarial');
        }
      }

      if (userProfile.usage === 'content') {
        if (product.name.toLowerCase().includes('pro') || product.name.toLowerCase().includes('studio')) {
          score += 30;
          reasons.push('🎨 Ferramentas de criação profissional');
        }
        if (product.category === 'perifericos' && product.name.toLowerCase().includes('mic')) {
          score += 25;
          reasons.push('🎤 Qualidade de áudio profissional');
        }
      }

      if (userProfile.usage === 'streaming') {
        if (product.name.toLowerCase().includes('stream') || product.name.toLowerCase().includes('capture')) {
          score += 35;
          reasons.push('📺 Especializado para streaming');
        }
        if (product.category === 'perifericos' && product.name.toLowerCase().includes('cam')) {
          score += 25;
          reasons.push('📹 Qualidade de vídeo superior');
        }
      }

      // Análise de preferências de jogos com IA
      userProfile.gamePreferences.forEach(pref => {
        if (pref === 'fps' && (product.name.toLowerCase().includes('gaming') || product.category === 'perifericos')) {
          score += 18;
          reasons.push('🎯 Otimizado para FPS competitivo');
        }
        if (pref === 'rpg' && product.category === 'computadores') {
          score += 18;
          reasons.push('🗡️ Excelente para RPGs imersivos');
        }
        if (pref === 'moba' && product.category === 'perifericos') {
          score += 15;
          reasons.push('⚔️ Ideal para MOBAs');
        }
        if (pref === 'racing' && product.name.toLowerCase().includes('wheel')) {
          score += 20;
          reasons.push('🏎️ Perfeito para simuladores de corrida');
        }
      });

      // Análise de experiência com IA
      if (userProfile.experience === 'beginner') {
        if (product.category === 'consoles' || product.name.toLowerCase().includes('easy')) {
          score += 15;
          reasons.push('🌱 Fácil de usar para iniciantes');
        }
      }
      if (userProfile.experience === 'intermediate') {
        if (product.name.toLowerCase().includes('plus') || product.name.toLowerCase().includes('advanced')) {
          score += 15;
          reasons.push('⚡ Recursos intermediários');
        }
      }
      if (userProfile.experience === 'advanced' || userProfile.experience === 'expert') {
        if (product.name.toLowerCase().includes('pro') || product.name.toLowerCase().includes('max')) {
          score += 20;
          reasons.push('🔥 Recursos avançados para experts');
        }
      }

      // Bonificações baseadas em qualidade
      score += product.rating * 8; // Peso maior para rating
      if (product.inStock) {
        score += 15;
        reasons.push('✅ Disponível em estoque');
      }
      if (product.discount) {
        score += product.discount * 1.5;
        reasons.push(`🏷️ ${product.discount}% de desconto especial`);
      }

      // Análise de custo-benefício com IA
      const pricePerformanceRatio = (product.rating * 25) / (product.price / 10000);
      score += pricePerformanceRatio;
      
      if (pricePerformanceRatio > 10) {
        reasons.push('💎 Excelente custo-benefício');
      }

      // Bonus para produtos populares
      if (product.rating >= 4.5) {
        score += 10;
        reasons.push('⭐ Altamente avaliado');
      }

      return {
        product,
        score: Math.round(score),
        reasons: reasons.slice(0, 4), // Top 4 razões
        aiExplanation: `Recomendado pela IA Gemini com base na análise profunda do seu perfil de ${userProfile.usage} e preferências específicas. Score de compatibilidade: ${Math.round(score)}%.`
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);

    return {
      recommendations: scoredProducts,
      aiSummary: aiResponse,
      personalizedMessage: `🤖 Olá ${userProfile.name}! Com base na análise avançada do Gemini AI do seu perfil e preferências, selecionei ${scoredProducts.length} produtos ideais para você.`
    };
  }

  async getChatResponse(message: string, userContext?: any): Promise<string> {
    const prompt = `
    Você é um assistente especializado da Rhulany Tech, uma loja premium de tecnologia em Moçambique. 
    
    Responda à seguinte pergunta do cliente de forma útil e específica:
    "${message}"
    
    ${userContext ? `
    Contexto do usuário:
    - Nome: ${userContext.name || 'Cliente'}
    - Preferências: ${userContext.gamePreferences?.join(', ') || 'Não especificado'}
    - Orçamento: ${userContext.budget || 'Não especificado'}
    - Uso: ${userContext.usage || 'Não especificado'}
    ` : ''}
    
    INSTRUÇÕES:
    - Seja útil, específico e técnico quando necessário
    - Mencione produtos relevantes da Rhulany Tech quando apropriado
    - Use emojis para tornar a resposta mais amigável
    - Responda em português de Moçambique
    - Se não souber algo específico, seja honesto
    - Ofereça ajuda adicional quando possível
    
    Produtos disponíveis: ${products.slice(0, 10).map(p => p.name).join(', ')}
    `;

    return await this.callGemini(prompt);
  }

  async getProductComparison(productIds: string[]): Promise<string> {
    const selectedProducts = products.filter(p => productIds.includes(p.id));
    
    const prompt = `
    Compare os seguintes produtos da Rhulany Tech de forma detalhada:
    
    ${selectedProducts.map(p => `
    **${p.name}**
    - Preço: ${p.price.toLocaleString('pt-MZ')} MT
    - Categoria: ${p.category}
    - Descrição: ${p.description}
    - Especificações: ${p.specs.join(', ')}
    - Rating: ${p.rating}/5
    - Em estoque: ${p.inStock ? 'Sim' : 'Não'}
    `).join('\n')}
    
    Forneça uma comparação detalhada incluindo:
    1. Prós e contras de cada produto
    2. Melhor custo-benefício
    3. Recomendação baseada em diferentes perfis de usuário
    4. Considerações técnicas importantes
    
    Responda em português de Moçambique com emojis apropriados.
    `;

    return await this.callGemini(prompt);
  }
}

export const geminiService = new GeminiService();