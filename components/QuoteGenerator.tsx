import React, { useState, ChangeEvent, useRef } from 'react';
import { QuoteData, User } from '../types';
import QuotePreview from './QuotePreview';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { Upload, Download, FileSpreadsheet, Image as ImageIcon, User as UserIcon, Car } from 'lucide-react';

// This maps the fields in QuoteData to specific cells in the Excel sheet.
const cellMapping: Record<keyof QuoteData, string> = {
  planName: 'B1',
  model: 'B2',
  planType: 'B3',
  totalInstallments: 'B4',
  installment1: 'B5',
  installments2to12: 'B6',
  installments13to84: 'B7',
  pureInstallment: 'B8',
  adjudication: 'B9',
  guaranteedDelivery: 'B10',
  extraordinaryPayment: 'B11',
  totalPlanValue: 'B12',
  brand: 'B13',
};

const emptyQuote: QuoteData = {
  planName: '',
  model: '',
  planType: '',
  brand: '',
  totalInstallments: '',
  installment1: '',
  installments2to12: '',
  installments13to84: '',
  pureInstallment: '',
  adjudication: '',
  guaranteedDelivery: '',
  extraordinaryPayment: '',
  totalPlanValue: '',
};

const labelMapping: Record<keyof QuoteData, string> = {
  planName: 'Nombre del Plan',
  model: 'Modelo',
  planType: 'Tipo de Plan',
  brand: 'Marca',
  totalInstallments: 'Total de Cuotas',
  installment1: 'Cuota 1',
  installments2to12: 'Cuotas 2 a 12',
  installments13to84: 'Cuotas 13 a 84',
  pureInstallment: 'Cuota Pura',
  adjudication: 'Adjudicación',
  guaranteedDelivery: 'Entrega Garantizada',
  extraordinaryPayment: 'Pago Extraordinario',
  totalPlanValue: 'Valor Total del Plan',
};

const quoteFields: (keyof QuoteData)[] = [
    'brand',
    'model',
    'planName',
    'planType',
    'totalInstallments',
    'installment1',
    'installments2to12',
    'installments13to84',
    'pureInstallment',
    'adjudication',
    'guaranteedDelivery',
    'extraordinaryPayment',
    'totalPlanValue',
  ];

const QuoteGenerator: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const { users } = useUsers();
  const [logo, setLogo] = useState<string | null>(null);
  const [carImage, setCarImage] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData>(emptyQuote);
  const [selectedSellerId, setSelectedSellerId] = useState<string>(loggedInUser?.id || '');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const quotePreviewRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCarImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCarImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleExcelUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = (window as any).XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const extractedData = { ...emptyQuote };
        for (const key in cellMapping) {
          if (Object.prototype.hasOwnProperty.call(cellMapping, key)) {
            const cellAddress = cellMapping[key as keyof QuoteData];
            const cell = worksheet[cellAddress];
            (extractedData as any)[key] = cell ? String(cell.v) : '';
          }
        }
        setQuoteData(extractedData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error al procesar el archivo Excel. Por favor, asegúrese de que sea un archivo .xlsx válido y que los datos estén en las celdas correctas.");
      }
    };
    reader.readAsArrayBuffer(file);
  };
  
  const handleDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDownloadPdf = async () => {
    if (!quotePreviewRef.current || !quoteData.brand || !quoteData.model) return;
    setLoading(true);
    try {
        const { jsPDF } = (window as any).jspdf;
        const canvas = await (window as any).html2canvas(quotePreviewRef.current, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        
        const margin = 10; // 10mm margin on each side
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        let finalWidth = pageWidth - (margin * 2);
        let finalHeight = finalWidth / canvasAspectRatio;

        // If the content is taller than the printable area, scale to fit height instead
        if (finalHeight > pageHeight - (margin * 2)) {
            finalHeight = pageHeight - (margin * 2);
            finalWidth = finalHeight * canvasAspectRatio;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;
        
        const fileName = `presupuesto-${quoteData.brand}-${quoteData.model}.pdf`.replace(/\s+/g, '_');

        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('No se pudo generar el PDF.');
    } finally {
        setLoading(false);
    }
  };
  
  const selectedSeller = users.find(u => u.id === selectedSellerId);
  
  const isQuoteDataEmpty = !quoteData.planName && !quoteData.model;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg self-start">
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            <h2 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400 pb-2">Configuración del Presupuesto</h2>
            
            {/* Logo Upload */}
            <div className="space-y-2">
                <label className="text-lg font-semibold text-gray-300 flex items-center"><ImageIcon className="mr-2 text-yellow-400" /> Logo de la Empresa</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"/>
            </div>

            {/* Car Image Upload */}
            <div className="space-y-2">
                <label className="text-lg font-semibold text-gray-300 flex items-center"><Car className="mr-2 text-yellow-400" /> Foto del Vehículo</label>
                <input type="file" accept="image/*" onChange={handleCarImageUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"/>
            </div>

            {/* Excel Upload */}
            <div className="space-y-2">
                <label className="text-lg font-semibold text-gray-300 flex items-center"><FileSpreadsheet className="mr-2 text-yellow-400" /> Datos del Presupuesto (Excel)</label>
                <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"/>
                {fileName && <p className="text-sm text-green-400 mt-2">Archivo cargado: {fileName}</p>}
            </div>

            {/* Seller Selection */}
            <div className="space-y-2">
                <label htmlFor="seller" className="text-lg font-semibold text-gray-300 flex items-center"><UserIcon className="mr-2 text-yellow-400" /> Vendedor</label>
                <select id="seller" value={selectedSellerId} onChange={(e) => setSelectedSellerId(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-yellow-500 focus:border-yellow-500">
                    {users.filter(u => u.role === 'seller').map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    {users.some(u => u.id === loggedInUser?.id && u.role === 'admin') && 
                    <option value={loggedInUser?.id}>{loggedInUser?.name} (Admin)</option>}
                </select>
            </div>

            {/* Quote Details Inputs */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center">Detalles del Presupuesto</h3>
                {quoteFields.map((key) => (
                    <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-400">
                        {labelMapping[key as keyof QuoteData]}
                    </label>
                    <input
                        type="text"
                        id={key}
                        name={key}
                        value={quoteData[key as keyof QuoteData]}
                        onChange={handleDataChange}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    />
                    </div>
                ))}
            </div>
        </div>
        <button 
          onClick={handleDownloadPdf} 
          disabled={!logo || !carImage || isQuoteDataEmpty || loading}
          className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" /> Descargar como PDF
            </>
          )}
        </button>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center lg:text-left">Vista Previa del Presupuesto</h2>
        <QuotePreview 
          ref={quotePreviewRef} 
          logo={logo} 
          carImage={carImage}
          data={quoteData} 
          seller={selectedSeller} 
        />
      </div>
    </div>
  );
};

export default QuoteGenerator;