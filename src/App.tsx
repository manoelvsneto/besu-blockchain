import React, { useState, useEffect } from 'react';
import { Web3 } from 'web3';
import { Database, Settings, Plus, Trash2, RefreshCw } from 'lucide-react';

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [besuEndpoint, setBesuEndpoint] = useState('http://localhost:8545');
  const [records, setRecords] = useState<Array<{ id: string; data: string }>>([]);
  const [newData, setNewData] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, [besuEndpoint]);

  const initializeWeb3 = async () => {
    try {
      const web3Instance = new Web3(besuEndpoint);
      setWeb3(web3Instance);
      
      // Check if we can connect to the network
      const networkId = await web3Instance.eth.net.getId();
      console.log('Connected to network:', networkId);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect to Besu network:', error);
      setConnected(false);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3?.eth.getAccounts();
        if (accounts && accounts[0]) {
          setAccount(accounts[0]);
        }
      } else {
        alert('Please install MetaMask or another Web3 wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const addRecord = async () => {
    if (!web3 || !account || !newData) return;
    
    try {
      // This is a simplified example. In a real application, you would:
      // 1. Call a smart contract method
      // 2. Wait for transaction confirmation
      // 3. Update the UI
      const newId = Date.now().toString();
      setRecords([...records, { id: newId, data: newData }]);
      setNewData('');
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      setRecords(records.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold">Besu CRUD App</span>
            </div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <button
                onClick={connectWallet}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium">Network Settings</h2>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={besuEndpoint}
              onChange={(e) => setBesuEndpoint(e.target.value)}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Besu RPC Endpoint"
            />
            <button
              onClick={initializeWeb3}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reconnect
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Records</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newData}
                onChange={(e) => setNewData(e.target.value)}
                className="border rounded-md px-3 py-2"
                placeholder="Enter data..."
              />
              <button
                onClick={addRecord}
                disabled={!connected || !account}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Record
              </button>
            </div>
          </div>

          <div className="divide-y">
            {records.map((record) => (
              <div key={record.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">ID: {record.id}</p>
                  <p className="text-lg">{record.data}</p>
                </div>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            {records.length === 0 && (
              <p className="text-center text-gray-500 py-4">No records found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;