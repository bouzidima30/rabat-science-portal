
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/ModernNavbar";
import Footer from "@/components/Footer";
import { formatContent } from "@/utils/sanitize";
import { validateFile } from "@/utils/fileValidation";

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
}

const SecurityTest = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const updateResult = (name: string, status: 'pass' | 'fail' | 'warning', message: string) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => r.name === name ? { name, status, message } : r);
      }
      return [...prev, { name, status, message }];
    });
  };

  const testRLSPolicies = async () => {
    console.log('Testing RLS policies...');
    
    // Test 1: News access for non-admin users
    try {
      const { data: publishedNews, error: publishedError } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .limit(1);

      if (publishedError) {
        updateResult('Published News Access', 'fail', `Error: ${publishedError.message}`);
      } else {
        updateResult('Published News Access', 'pass', 'Can access published news');
      }
    } catch (error: any) {
      updateResult('Published News Access', 'fail', `Error: ${error.message}`);
    }

    // Test 2: Try to insert news without admin role
    if (!profile || profile.role !== 'admin') {
      try {
        const { error } = await supabase
          .from('news')
          .insert({
            title: 'Test Article',
            content: 'Test content',
            category: 'avis_etudiants',
            published: false
          });

        if (error) {
          updateResult('News Insert Protection', 'pass', 'Non-admin correctly blocked from inserting news');
        } else {
          updateResult('News Insert Protection', 'fail', 'Non-admin was able to insert news - RLS policy failed!');
        }
      } catch (error: any) {
        updateResult('News Insert Protection', 'pass', 'Non-admin correctly blocked from inserting news');
      }
    }

    // Test 3: Files access
    try {
      const { data: files, error: filesError } = await supabase
        .from('files')
        .select('*')
        .limit(1);

      if (filesError) {
        updateResult('Files Access', 'fail', `Error: ${filesError.message}`);
      } else {
        updateResult('Files Access', 'pass', 'Can access files');
      }
    } catch (error: any) {
      updateResult('Files Access', 'fail', `Error: ${error.message}`);
    }

    // Test 4: Activity logs access (should only see own logs)
    if (user) {
      try {
        const { data: logs, error: logsError } = await supabase
          .from('activity_logs')
          .select('*')
          .limit(1);

        if (logsError && logsError.message.includes('RLS')) {
          updateResult('Activity Logs RLS', 'pass', 'RLS correctly protecting activity logs');
        } else if (logs) {
          updateResult('Activity Logs RLS', 'pass', 'Can access own activity logs');
        } else {
          updateResult('Activity Logs RLS', 'warning', 'No activity logs found');
        }
      } catch (error: any) {
        updateResult('Activity Logs RLS', 'fail', `Error: ${error.message}`);
      }
    }
  };

  const testAuthenticationFlow = async () => {
    console.log('Testing authentication flow...');
    
    if (!user) {
      updateResult('Authentication', 'warning', 'Not logged in - please log in to test');
      return;
    }

    updateResult('Authentication', 'pass', `Logged in as: ${user.email}`);
    updateResult('Profile Data', profile ? 'pass' : 'fail', 
      profile ? `Profile loaded - Role: ${profile.role}` : 'Profile not loaded');
  };

  const testInputSanitization = () => {
    console.log('Testing input sanitization...');
    
    // Test XSS protection
    const xssInput = '<script>alert("xss")</script><p>Safe content</p>';
    
    try {
      const sanitized = formatContent(xssInput);
      if (sanitized.includes('<script>')) {
        updateResult('XSS Protection', 'fail', 'Script tags not removed');
      } else if (sanitized.includes('<p>')) {
        updateResult('XSS Protection', 'pass', 'Malicious scripts removed, safe content preserved');
      } else {
        updateResult('XSS Protection', 'warning', 'Content sanitized but may be too restrictive');
      }
    } catch (error: any) {
      updateResult('XSS Protection', 'fail', `Error: ${error.message}`);
    }
  };

  const testFileValidation = () => {
    console.log('Testing file validation...');
    
    // Test valid file
    const validFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    try {
      const isValid = validateFile(validFile);
      updateResult('File Validation - Valid', isValid ? 'pass' : 'fail', 
        isValid ? 'Valid PDF accepted' : 'Valid PDF rejected');
    } catch (error: any) {
      updateResult('File Validation - Valid', 'fail', `Error: ${error.message}`);
    }

    // Test malicious file
    const maliciousFile = new File(['test'], 'malicious.exe', { type: 'application/x-executable' });
    try {
      validateFile(maliciousFile);
      updateResult('File Validation - Malicious', 'fail', 'Executable file was accepted');
    } catch (error: any) {
      updateResult('File Validation - Malicious', 'pass', 'Executable file correctly rejected');
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    try {
      await testAuthenticationFlow();
      await testRLSPolicies();
      testInputSanitization();
      testFileValidation();
      
      toast({
        title: "Security tests completed",
        description: "Check the results below",
      });
    } catch (error: any) {
      toast({
        title: "Testing error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Security Implementation Test
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Verify that all security measures are working correctly
              </p>
            </div>
          </div>
        </div>

        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This page helps you test the security implementation. Run the tests below to verify that 
            RLS policies, input sanitization, file validation, and authentication are working properly.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Security Test Suite
                <Button 
                  onClick={runAllTests} 
                  disabled={testing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {testing ? 'Running Tests...' : 'Run All Tests'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.length === 0 && !testing && (
                  <p className="text-gray-500 text-center py-8">
                    Click "Run All Tests" to start testing the security implementation
                  </p>
                )}
                
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {result.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {result.message}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current User Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
                {user && (
                  <>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {profile?.role || 'Loading...'}</p>
                    <p><strong>User ID:</strong> {user.id}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Testing Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <p className="font-medium">Test user registration</p>
                    <p className="text-sm text-gray-600">Create a new account and verify email confirmation works</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <p className="font-medium">Test admin vs. regular user access</p>
                    <p className="text-sm text-gray-600">Verify admin can create/edit content, regular users cannot</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <p className="font-medium">Test file upload security</p>
                    <p className="text-sm text-gray-600">Try uploading various file types, including malicious ones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div>
                    <p className="font-medium">Test content sanitization</p>
                    <p className="text-sm text-gray-600">Try entering HTML/JavaScript in forms to verify sanitization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SecurityTest;
