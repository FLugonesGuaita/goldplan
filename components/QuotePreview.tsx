import React, { forwardRef } from 'react';
import { QuoteData, User } from '../types';

interface QuotePreviewProps {
  logo: string | null;
  carImage: string | null;
  data: QuoteData | null;
  seller: User | undefined;
}

const QuoteRow = ({ label, value, isHighlighted = false, isTotal = false }: { label: string, value: string | React.ReactNode, isHighlighted?: boolean, isTotal?: boolean }) => (
    <div className={`flex justify-between items-center py-3 px-4 ${isHighlighted ? 'bg-gray-50' : ''} ${isTotal ? 'border-t-2 border-gray-300' : 'border-b border-gray-200'}`}>
      <p className={`text-sm ${isTotal ? 'font-bold' : ''} text-gray-600`}>{label}</p>
      <p className={`font-semibold ${isTotal ? 'text-xl text-black' : 'text-gray-800'} text-right`}>{value}</p>
    </div>
  );

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(({ logo, data, carImage, seller }, ref) => {
    
  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null || value === '' || value === 'N/A') return 'N/A';
    const num = Number(String(value).replace(/[^0-9.-]+/g,""));
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const isDataEmpty = !data || !Object.values(data).some(v => v !== '');

  return (
    <div ref={ref} id="quote-preview" className="bg-[#0a0f1e] text-black w-full max-w-2xl mx-auto p-4 sm:p-8 shadow-2xl rounded-lg transform scale-90 lg:scale-100 origin-top">
      <div className="bg-white rounded-md overflow-hidden">
        <header className="bg-gray-900 p-6 sm:p-10 flex justify-center items-center h-40">
          {logo ? (
            <img src={logo} alt="Company Logo" className="max-h-full max-w-xs object-contain" />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-600 flex items-center justify-center rounded">
              <span className="text-gray-400 text-lg">Logo de la Empresa</span>
            </div>
          )}
        </header>

        <main className="p-6 sm:p-10">
            {isDataEmpty ? (
            <div className="text-center text-gray-500 py-20">
                <p>Complete los detalles del presupuesto para ver la vista previa.</p>
            </div>
            ) : (
            <div className="space-y-8">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="w-full h-48 md:h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        {carImage ? (
                            <img src={carImage} alt={`${data.brand} ${data.model}`} className="w-full h-full object-cover rounded-lg"/>
                        ) : (
                            <span className="text-gray-500">Foto del Vehículo</span>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm font-semibold text-yellow-600">{data.brand?.toUpperCase()}</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{data.model}</h1>
                        <p className="mt-2 text-gray-600">{data.planName}</p>
                        <p className="text-sm text-gray-500">{data.planType} | {data.totalInstallments} Cuotas</p>
                    </div>
                </section>
                
                <section className="border border-gray-200 rounded-lg overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-800 bg-gray-50 p-4 border-b border-gray-200">Detalles del Plan</h2>
                    <div className="divide-y divide-gray-200">
                        <QuoteRow label="Cuota 1" value={formatCurrency(data.installment1)} />
                        <QuoteRow label="Cuotas 2 a 12" value={formatCurrency(data.installments2to12)} isHighlighted/>
                        <QuoteRow label="Cuotas 13 a 84" value={formatCurrency(data.installments13to84)} />
                        <QuoteRow label="Cuota Pura" value={formatCurrency(data.pureInstallment)} isHighlighted/>
                        <QuoteRow label="Alicuota Extraordinaria (30%)" value={formatCurrency(data.extraordinaryPayment)} />
                    </div>
                     <div className="bg-gray-50">
                        <QuoteRow label="Valor Total del Plan" value={formatCurrency(data.totalPlanValue)} isTotal />
                     </div>
                </section>
                
                <section className="text-center text-xs text-gray-500 space-y-1">
                    <p><span className="font-semibold">Adjudicación:</span> {data.adjudication}</p>
                    <p><span className="font-semibold">Entrega asegurada por contrato:</span> {data.guaranteedDelivery}</p>
                </section>
            </div>
            )}

            {seller && (
            <footer className="text-center mt-12 pt-6 border-t-2 border-gray-200 space-y-1">
                <p className="font-bold text-lg text-gray-800">{seller.name}</p>
                <p className="text-sm text-gray-600">{seller.title}</p>
                <p className="text-sm text-gray-500">{seller.address}</p>
                <p className="text-sm text-gray-500">{seller.phone}</p>
            </footer>
            )}
        </main>
      </div>
    </div>
  );
});

export default QuotePreview;
