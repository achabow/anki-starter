import React, { ReactNode } from 'react';

interface DataManagementLayoutProps {
  title: string;
  listTitle: string;
  onAddNew?: () => void;
  children: ReactNode;
  isFormVisible?: boolean;
  formContent?: ReactNode;
}

const DataManagementLayout: React.FC<DataManagementLayoutProps> = ({
                                                                     title,
                                                                     listTitle,
                                                                     onAddNew,
                                                                     children,
                                                                     isFormVisible,
                                                                     formContent,
                                                                   }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 backdrop-blur-2xl">
          <h1 className="text-3xl font-bold text-black">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{listTitle}</h2>
                {onAddNew && (
                  <button
                    onClick={onAddNew}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="border-t border-gray-200">
                {children}
              </div>
            </div>
            {isFormVisible && formContent}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataManagementLayout;