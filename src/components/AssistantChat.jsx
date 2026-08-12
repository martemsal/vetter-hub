import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Bot, HardDrive, ExternalLink, 
  Mic, MicOff, Volume2, VolumeX, Square 
} from 'lucide-react';
import { PROPERTIES_DATA, DRIVE_ROOT_URL } from '../data/properties';

export default function AssistantChat({ onNavigateToPlan }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Olá! Sou seu **Assistente Agêntico Imobiliário Vetter**.\n\nVocê pode me perguntar digitando ou **falando por áudio no microfone**!\n\n• "Quais empreendimentos têm 4 suítes?"\n• "Qual a metragem do living no Palm Beach?"\n• "Link da tabela de preços e pasta do Google Drive"'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const quickPrompts = [
    'Qual a metragem da suíte master no Palm Beach?',
    'Quais empreendimentos têm 4 suítes frente mar?',
    'Link da tabela de vendas e pasta do Drive',
    'Dimensões do living no Ocean Breeze'
  ];

  // Configuração do Reconhecimento de Voz (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Seu navegador não suporta reconhecimento de voz direto. Tente no Google Chrome ou Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputText('');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Síntese de Voz (Text-to-Speech)
  const toggleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Limpa marcações markdown para leitura natural
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/•/g, '')
      .replace(/[\n\r]+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Processamento da resposta agêntica
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = '';

      if (lower.includes('palm beach') || lower.includes('palm')) {
        reply = `🏢 **Palm Beach Vetter (Balneário Piçarras)**\n\n` +
          `• **Tipologia:** 3 a 4 Suítes (142m² a 285m² privativos)\n` +
          `• **Suíte Master (Tipo 01):** 5,20m x 4,10m = **21,32 m²** privativos (+ Banheiro Master com cuba dupla de **7,44 m²**)\n` +
          `• **Living Integrado:** 8,40m x 5,90m = **49,56 m²**\n` +
          `• **Vagas:** 2 a 4 Vagas de garagem + Hobby Box\n\n` +
          `📂 [Acessar Pasta do Palm Beach no Drive](${DRIVE_ROOT_URL})`;
      } else if (lower.includes('ocean breeze') || lower.includes('ocean')) {
        reply = `🌊 **Ocean Breeze Vetter (Praia da Armação, Penha)**\n\n` +
          `• **Living Gourmet:** 6,90m x 4,80m = **33,12 m²**\n` +
          `• **Suíte Master:** 4,40m x 3,60m = **15,84 m²**\n` +
          `• **Localização:** A apenas 50 metros da areia da praia\n` +
          `• **Status:** Em construção (Entrega: Jun/2027)\n\n` +
          `📂 [Acessar Arquivos no Google Drive](${DRIVE_ROOT_URL})`;
      } else if (lower.includes('tabela') || lower.includes('vendas') || lower.includes('preço') || lower.includes('drive') || lower.includes('pasta')) {
        reply = `📊 **Acesso aos Documentos Oficiais Vetter:**\n\n` +
          `• **Pasta Raiz do Google Drive:** [Abrir Pasta Geral do Drive](${DRIVE_ROOT_URL})\n` +
          `• **Tabelas de Vendas:** Disponíveis no Drive com condições de parcelamento direto e fluxo de obra.\n` +
          `• **Books e Plantas em PDF:** Todos os arquivos em alta resolução sincronizados.`;
      } else if (lower.includes('4 suítes') || lower.includes('quatro suítes') || lower.includes('frente mar')) {
        reply = `💎 **Empreendimentos Frente Mar com 4 Suítes:**\n\n` +
          `1. **Palm Beach Vetter:** Piçarras • 178m² a 285m² • 3 a 4 Vagas • Frente Mar Total\n` +
          `2. **Grand Palais Vetter:** Penha • 195m² a 340m² • 4 Suítes Plenas • Alto Luxo Boutique\n\n` +
          `Você pode visualizar as plantas completas cotadas na aba **Plantas**!`;
      } else {
        reply = `Encontrei as seguintes informações correspondentes na base Vetter:\n\n` +
          `Temos **4 empreendimentos ativos** cadastrados com plantas baixas, cotas e arquivos sincronizados no Google Drive.\n\n` +
          `Deseja que eu detalhe as medidas de algum cômodo específico ou abra a pasta de arquivos no Drive?`;
      }

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: reply
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 450);
  };

  return (
    <div className="assistant-view-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="brand-logo-icon" style={{ width: 32, height: 32 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Assistente por Voz & Texto</div>
            <div style={{ fontSize: 11, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
              Voz e Áudio Ativados • Drive Sincronizado
            </div>
          </div>
        </div>
      </div>

      {isRecording && (
        <div className="voice-status-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="voice-wave-bars">
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
            </div>
            <span>Ouvindo sua voz... Fale o que procura</span>
          </div>
          <button 
            onClick={toggleVoiceRecording} 
            style={{ color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Square size={13} fill="currentColor" />
            <span>Parar</span>
          </button>
        </div>
      )}

      <div className="chat-messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.sender === 'assistant' && (
              <div className="assistant-avatar-row">
                <Bot size={14} color="var(--gold-primary)" />
                <span className="assistant-badge-name">Vetter AI</span>
              </div>
            )}
            <div style={{ whiteSpace: 'pre-line' }}>
              {msg.text.split('\n').map((line, i) => {
                if (line.includes('[') && line.includes('](')) {
                  const label = line.substring(line.indexOf('[') + 1, line.indexOf(']('));
                  const url = line.substring(line.indexOf('](') + 2, line.indexOf(')'));
                  return (
                    <p key={i} style={{ marginTop: 4 }}>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: 'var(--gold-primary)', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        {label} <ExternalLink size={12} />
                      </a>
                    </p>
                  );
                }
                return <p key={i} style={{ margin: '2px 0' }}>{line}</p>;
              })}
            </div>

            {msg.sender === 'assistant' && (
              <div>
                <button 
                  className={`speak-response-btn ${speakingMsgId === msg.id ? 'speaking' : ''}`}
                  onClick={() => toggleSpeak(msg.id, msg.text)}
                  title="Ouvir resposta por áudio"
                >
                  {speakingMsgId === msg.id ? (
                    <>
                      <VolumeX size={12} />
                      <span>Parar Áudio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={12} />
                      <span>Ouvir Resposta</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões Rápidas */}
      <div className="chat-suggestions-row">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            className="chat-suggestion-chip"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Campo de Entrada de Mensagem com Microfone */}
      <div className="chat-input-bar">
        <button 
          className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleVoiceRecording}
          title={isRecording ? 'Parar gravação de voz' : 'Falar por áudio'}
          aria-label="Gravar áudio"
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          placeholder={isRecording ? "Ouvindo sua voz..." : "Digite ou fale sua dúvida..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />

        <button className="chat-send-btn" onClick={() => handleSend()} aria-label="Enviar">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
