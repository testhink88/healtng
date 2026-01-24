/* PROPS:
  - steps: Array de objetos { id, title, component: ReactComponent }
  - onComplete: Función al terminar
  - initialData: Datos precargados
*/
const WizardEngine = ({ steps, onComplete }) => {
   const [currentStep, setCurrentStep] = useState(0);
   const [formData, setFormData] = useState({});

   const ActiveComponent = steps[currentStep].component;

   const handleNext = (stepData) => {
      const updatedData = { ...formData, ...stepData };
      setFormData(updatedData);
      
      if (currentStep < steps.length - 1) {
         setCurrentStep(prev => prev + 1);
      } else {
         onComplete(updatedData);
      }
   };

   return (
      <div className="wizard-container">
         {/* Stepper Visual (Top) */}
         <div className="flex justify-between mb-8">
            {steps.map((s, idx) => (
               <div key={s.id} className={idx <= currentStep ? "text-blue-600 font-bold" : "text-gray-300"}>
                  {idx + 1}. {s.title}
               </div>
            ))}
         </div>

         {/* Contenido Dinámico */}
         <div className="min-h-[300px]">
            <ActiveComponent 
               data={formData} 
               onNext={handleNext} 
               onBack={() => setCurrentStep(p => p - 1)} 
            />
         </div>
      </div>
   )
}