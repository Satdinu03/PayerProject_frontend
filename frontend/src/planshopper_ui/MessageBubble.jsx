import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MessageBubble = ({ message, isUser, hasTable, tableData }) => {
  const bubbleStyle = {
    maxWidth: '85%',
    margin: '10px',
    padding: '12px 16px',
    borderRadius: '18px',
    wordWrap: 'break-word',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#0ea5e9' : '#f1f5f9',
    color: isUser ? 'white' : 'black',
    marginLeft: isUser ? 'auto' : '10px',
    marginRight: isUser ? '10px' : 'auto',
    overflowX: 'auto'
  };

  const downloadButtonStyle = {
    marginBottom: '10px',
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const hasTableInMessage = message && message.includes('|') && message.includes('---');

  const parseMarkdownTable = (markdown) => {
    const lines = markdown.split('\n').filter(line => line.includes('|'));
    const dataLines = lines.filter(line => !line.includes('---'));
    
    return dataLines.map(line => {
      return line
        .split('|')
        .map(cell => cell.trim().replace(/\*\*/g, ''))
        .filter(cell => cell);
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const tableArray = parseMarkdownTable(message);
    
    if (tableArray.length === 0) {
      alert('No table data to download');
      return;
    }
    
    doc.setFontSize(18);
    doc.text('Plan Comparison Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    
    doc.autoTable({
      head: [tableArray[0]],
      body: tableArray.slice(1),
      startY: 30,
      theme: 'striped',
      headStyles: { 
        fillColor: [14, 165, 233],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 40 }
      }
    });
    
    doc.save(`plan-comparison-${Date.now()}.pdf`);
  };

  const renderMessage = () => {
    if (!hasTableInMessage) {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>;
    }

    const parts = message.split('\n');
    let textBeforeTable = [];
    let tableLines = [];
    let textAfterTable = [];
    let inTable = false;
    let tableEnded = false;

    for (let line of parts) {
      if (line.includes('|')) {
        inTable = true;
        tableLines.push(line);
      } else if (inTable && !line.trim()) {
        tableEnded = true;
      } else if (!inTable) {
        textBeforeTable.push(line);
      } else if (tableEnded) {
        textAfterTable.push(line);
      }
    }

    let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 11px;">';
    let isHeader = true;

    for (let line of tableLines) {
      if (line.includes('|') && !line.includes('---')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        tableHtml += '<tr>';
        cells.forEach(cell => {
          const cleanCell = cell.replace(/\*\*/g, '');
          if (isHeader) {
            tableHtml += `<th style="border: 1px solid #ddd; padding: 8px; background-color: #0ea5e9; color: white; font-size: 11px; white-space: nowrap;">${cleanCell}</th>`;
          } else {
            tableHtml += `<td style="border: 1px solid #ddd; padding: 6px; font-size: 10px; white-space: nowrap;">${cleanCell}</td>`;
          }
        });
        tableHtml += '</tr>';
        isHeader = false;
      }
    }
    tableHtml += '</table>';

    return (
      <div>
        {textBeforeTable.length > 0 && (
          <div style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
            {textBeforeTable.join('\n')}
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
        {textAfterTable.length > 0 && (
          <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            {textAfterTable.join('\n')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {!isUser && hasTableInMessage && (
        <button 
          onClick={handleDownloadPDF} 
          style={{ ...downloadButtonStyle, alignSelf: 'flex-start', marginLeft: '10px' }}
        >
          📄 Download as PDF
        </button>
      )}
      <div style={bubbleStyle}>
        {renderMessage()}
      </div>
    </div>
  );
};

export default MessageBubble;
