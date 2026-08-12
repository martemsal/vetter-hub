import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Bot, 
  Mic, MicOff, Volume2, VolumeX, Download, Eye, 
  Share2, FileText, Image, FileSpreadsheet, X, CheckCircle, Search 
} from 'lucide-react';
import { PROPERTIES_DATA } from '../data/properties';
import { findMatchingFiles } from '../utils/searchEngine';

export default function AssistantChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Olá! Dite ou digite o arquivo que você procura (ex: *"tabela do Royal Bay"* ou *"tabela do The Ocean"*).\nEu localizo nas pastas do Google Drive e trago **somente o arquivo solicitado** para você baixar.',
      files: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
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
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareFile = (file) => {
    const text = `Arquivo Oficial Vetter: *${file.title}*\nDownload direto: ${file.url}`;
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
      const searchResult = findMatchingFiles(query, PROPERTIES_DATA);
      const { matchedFiles, matchedProperty } = searchResult;

      let replyText = '';

      if (matchedFiles && matchedFiles.length > 0) {
        const file = matchedFiles[0];
        replyText = `Arquivo localizado: **${file.propertyName}**`;
      } else {
        replyText = `Não localizei nenhum arquivo correspondente a "${query}". Verifique o nome do empreendimento (ex: Royal Bay, Palm Beach, The Ocean).`;
      }

      const newMsgId = Date.now() + 1;
      const assistantMsg = {
        id: newMsgId,
        sender: 'assistant',
        text: replyText,
        files: matchedFiles
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (wasVoice && matchedFiles && matchedFiles.length > 0) {
        speakText(`Aqui está a ${matchedFiles[0].title}`, newMsgId);
      }
    }, 350);
  };

  const getFileIcon = (file) => {
    if (file.type === 'pdf') {
      if (file.category === 'tabela') return <FileSpreadsheet size={20} color="var(--accent-emerald)" />;
      return <FileText size={20} color="var(--gold-primary)" />;
    }
    return <Image size={20} color="var(--accent-cyan)" />;
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
            <div style={{ fontSize: 14, fontWeight: 700 }}>Assistente de Entrega Direta</div>
            <div style={{ fontSize: 11, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={12} />
              <span>Entrega Exclusiva do Arquivo Solicitado</span>
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
          <span>Localizando o arquivo no Google Drive...</span>
        </div>
      )}

      {/* Lista de Mensagens com espaçamento adequado */}
      <div className="chat-messages-area" style={{ paddingBottom: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            {msg.sender === 'assistant' && (
              <div className="assistant-avatar-row">
                <Bot size={14} color="var(--gold-primary)" />
                <span className="assistant-badge-name">Vetter Arquivos</span>
              </div>
            )}
            
            <div style={{ whiteSpace: 'pre-line' }}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '2px 0' }}>{line}</p>
              ))}
            </div>

            {/* Renderiza SOMENTE O ARQUIVO SOLICITADO */}
            {msg.files && msg.files.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {msg.files.map((file) => (
                  <div key={file.id} className="chat-file-card">
                    <div className="file-header-row">
                      <div className="file-type-icon-box">
                        {getFileIcon(file)}
                      </div>
                      <div className="file-info-col">
                        <div className="file-display-name" title={file.name}>{file.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--gold-primary)', fontFamily: 'monospace', marginTop: 1 }}>
                          📄 {file.name}
                        </div>
                        <div className="file-meta-row">
                          <span style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--gold-primary)' }}>{file.type}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                          <span>•</span>
                          <span style={{ color: 'var(--accent-emerald)' }}>Google Drive Oficial</span>
                        </div>
                      </div>
                    </div>

                    {file.previewImage && (
                      <div className="file-preview-image-box" onClick={() => setPreviewFile(file)} style={{ cursor: 'pointer' }}>
                        <img src={file.previewImage} alt={file.title} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                          <span className="gold-badge"><Eye size={12} /> Ver Prévia</span>
                        </div>
                      </div>
                    )}

                    <div className="file-actions-row">
                      <button 
                        className="file-btn-download"
                        onClick={() => handleDownload(file)}
                        title="Baixar arquivo agora"
                      >
                        <Download size={14} />
                        <span>Baixar Arquivo</span>
                      </button>

                      <button 
                        className="file-btn-preview"
                        onClick={() => setPreviewFile(file)}
                        title="Visualizar na tela"
                      >
                        <Eye size={14} />
                        <span>Prévia</span>
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

      {/* Sugestões Rápidas */}
      <div className="chat-suggestions-row">
        {[
          'Tabela do Royal Bay',
          'Tabela do The Ocean',
          'Planta do Palm Beach',
          'Book do Grand Palais'
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
          placeholder={isRecording ? "Ouvindo sua voz... (envia ao parar)" : "Ex: tabela do Royal Bay..."}
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

      {/* Modal de Prévia */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div 
            className="modal-bottom-sheet" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '94vh' }}
          >
            <div className="sheet-handle-bar">
              <div className="sheet-handle" />
            </div>

            <div className="modal-header">
              <div>
                <span className="gold-badge">{previewFile.type.toUpperCase()}</span>
                <h3 style={{ fontSize: 16, marginTop: 4 }}>{previewFile.title}</h3>
                <div style={{ fontSize: 12, color: 'var(--gold-primary)', fontFamily: 'monospace' }}>{previewFile.name} • {previewFile.size}</div>
              </div>
              <button className="modal-close-btn" onClick={() => setPreviewFile(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#020617', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <img 
                  src={previewFile.url} 
                  alt={previewFile.title} 
                  style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', display: 'block' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleDownload(previewFile)}
                  style={{ flex: 1 }}
                >
                  <Download size={16} />
                  <span>Baixar Arquivo</span>
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => handleShareFile(previewFile)}
                >
                  <Share2 size={16} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
