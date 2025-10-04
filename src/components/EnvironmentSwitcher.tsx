"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Server, Database, CheckCircle, XCircle } from 'lucide-react';

interface EnvironmentStatus {
  environment: string;
  frontend: string;
  backend: string;
  backendAvailable: boolean;
  timestamp: string;
}

export function EnvironmentSwitcher() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus({
          environment: data.data.environment.isDevelopment ? 'Development' : 'Production',
          frontend: data.data.api.frontend,
          backend: data.data.api.backend,
          backendAvailable: data.data.api.status.isAvailable,
          timestamp: data.data.timestamp,
        });
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Server className="w-5 h-5" />
          Environment Status
        </h3>
        <Button
          onClick={checkStatus}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {status && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Environment:</span>
            <Badge variant={status.environment === 'Development' ? 'default' : 'secondary'}>
              {status.environment}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Frontend:</span>
            <span className="text-sm text-gray-600">{status.frontend}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Backend:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{status.backend}</span>
              {status.backendAvailable ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={status.backendAvailable ? 'default' : 'destructive'}>
              {status.backendAvailable ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>

          <div className="text-xs text-gray-500">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {!status && !loading && (
        <div className="text-center text-gray-500 py-4">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Click refresh to check environment status</p>
        </div>
      )}
    </Card>
  );
}
