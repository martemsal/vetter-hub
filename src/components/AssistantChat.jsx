import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Bot, 
  Mic, MicOff, Volume2, VolumeX, Download, Eye, 
  Share2, FileSpreadsheet, FileText, CheckCircle, Search, ExternalLink 
} from 'lucide-react';
import { getStoredDriveIndex } from '../data/driveIndex';
import { searchDriveWithGeminiIntelligence } from '../utils/geminiDriveEngine';

export default function AssistantChat() {
  const [driveFiles] = useState(() => getStoredDriveIndex());
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Olá! Sou seu assistente conectado diretamente à pasta do **Google Drive**.\n\n🎙️ Fale por áudio ou digite o arquivo desejado (ex: *"Tabela do Bal Harbour"*, *"Tabela do Royal Bay"* ou *"Apresentação The Wave"*).\n\nEu identifico o arquivo na pasta e trago o **link de download direto e prévia** na tela.',
      files: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const latestTranscriptRef = useRef('');

  // Reconhecimento de Voz com Envio Automático ao terminar de falar
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setIsProcessingVoice(false);
        latestTranscriptRef.current = '';
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        latestTranscriptRef.current = transcript;
        setInputText(transcript);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 1100);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessingVoice(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        const finalQuery = latestTranscriptRef.current.trim();
        if (finalQuery) {
          setIsProcessingVoice(true);
          handleSend(finalQuery, true);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador. Utilize o Google Chrome ou Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setInputText('');
      latestTranscriptRef.current = '';
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const speakText = (text, msgId) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

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

  const handleDownload = (file) => {
    window.open(file.url, '_blank');
  };

  const handlePreview = (file) => {
    window.open(file.viewUrl, '_blank');
  };

  const handleShareFile = (file) => {
    const text = `Arquivo Oficial Google Drive: *${file.name}*\nVisualizar no Drive: ${file.viewUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRecording, isProcessingVoice]);

  const handleSend = (textToSend, wasVoice = false) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      wasVoice
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    latestTranscriptRef.current = '';
    setIsProcessingVoice(false);

    setTimeout(() => {
      // Motor de Busca Inteligente estilo Gemini Drive
      const searchResult = searchDriveWithGeminiIntelligence(query, driveFiles);
      const newMsgId = Date.now() + 1;

      if (searchResult.status === 'found' && searchResult.file) {
        const assistantMsg = {
          id: newMsgId,
          sender: 'assistant',
          text: `Arquivo localizado: **${searchResult.file.propertyName}**`,
          files: [searchResult.file]
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (wasVoice) {
          speakText(`Aqui está o arquivo ${searchResult.file.name}`, newMsgId);
        }
      } else {
        const assistantMsg = {
          id: newMsgId,
          sender: 'assistant',
          text: searchResult.message,
          files: []
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (wasVoice) {
          speakText(`Não encontrei este arquivo no Google Drive.`, newMsgId);
        }
      }
    }, 350);
  };

  const getFileIcon = (file) => {
    if (file.category === 'tabela') return <FileSpreadsheet size={20} color="var(--accent-emerald)" />;
    return <FileText size={20} color="var(--gold-primary)" />;
  };

  return (
    <div className="assistant-view-container">
      {/* Header do Chat */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="brand-logo-icon" style={{ width: 32, height: 32 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Busca Gemini no Google Drive</div>
            <div style={{ fontSize: 11, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={12} />
              <span>{driveFiles.length} arquivos sincronizados nas pastas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Gravação */}
      {isRecording && (
        <div className="voice-status-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="voice-wave-bars">
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
              <div className="voice-bar" />
            </div>
            <span>🎙️ Ouvindo... (envia ao parar de falar)</span>
          </div>
          <button 
            onClick={toggleVoiceRecording} 
            style={{ color: 'var(--accent-rose)', fontWeight: 700, fontSize: 11, padding: '2px 8px' }}
          >
            Enviar
          </button>
        </div>
      )}

      {isProcessingVoice && (
        <div className="voice-status-banner" style={{ background: 'rgba(230, 195, 92, 0.15)', borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}>
          <Search size={14} />
          <span>Vasculhando arquivos nas pastas do Google Drive...</span>
        </div>
      )}

      {/* Lista de Mensagens */}
      <div className="chat-messages-area" style={{ paddingBottom: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.sender === 'assistant' && (
              <div className="assistant-avatar-row">
                <Bot size={14} color="var(--gold-primary)" />
                <span className="assistant-badge-name">Vetter Drive Search</span>
              </div>
            )}
            
            <div style={{ whiteSpace: 'pre-line' }}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '2px 0' }}>{line}</p>
              ))}
            </div>

            {/* Renderiza SOMENTE O ARQUIVO EXATO SOLICITADO */}
            {msg.files && msg.files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {msg.files.map((file) => (
                  <div key={file.id} className="chat-file-card">
                    <div className="file-header-row">
                      <div className="file-type-icon-box">
                        {getFileIcon(file)}
                      </div>
                      <div className="file-info-col">
                        <div className="file-display-name" title={file.name}>{file.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--gold-primary)', fontFamily: 'monospace', marginTop: 2 }}>
                          📄 {file.name}
                        </div>
                        <div className="file-meta-row">
                          <span style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--gold-primary)' }}>{file.type}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                          <span>•</span>
                          <span style={{ color: 'var(--accent-emerald)' }}>{file.folder}</span>
                        </div>
                      </div>
                    </div>

                    <div className="file-actions-row">
                      <button 
                        className="file-btn-download"
                        onClick={() => handleDownload(file)}
                        title="Baixar arquivo direto do Google Drive"
                      >
                        <Download size={14} />
                        <span>Baixar Arquivo</span>
                      </button>

                      <button 
                        className="file-btn-preview"
                        onClick={() => handlePreview(file)}
                        title="Visualizar no Google Drive"
                      >
                        <Eye size={14} />
                        <span>Ver no Drive</span>
                        <ExternalLink size={11} />
                      </button>

                      <button 
                        className="file-btn-preview"
                        onClick={() => handleShareFile(file)}
                        title="Compartilhar no WhatsApp"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões Rápidas com Empreendimentos Reais da Pasta */}
      <div className="chat-suggestions-row">
        {[
          'Tabela do Bal Harbour',
          'Tabela do Royal Bay',
          'Tabela do The Ocean',
          'Apresentação The Wave',
          'Tabela Blue Coast',
          'Tabela Destin Beach'
        ].map((prompt, idx) => (
          <button
            key={idx}
            className="chat-suggestion-chip"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input de Mensagem com Microfone e Auto-Send */}
      <div className="chat-input-bar">
        <button 
          className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleVoiceRecording}
          title={isRecording ? 'Parar gravação' : 'Falar por áudio (envio automático)'}
          aria-label="Gravar áudio"
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          placeholder={isRecording ? "Ouvindo sua voz... (envia ao parar)" : "Ex: tabela do bal harbour..."}
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
