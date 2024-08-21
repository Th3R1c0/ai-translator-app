'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings2, RotateCw, MessageSquare } from 'lucide-react';
const advancedSettings = [
  { name: 'Tone Preset', options: ['Business Level', 'Casual', 'Formal'] },
  {
    name: 'Language Level',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  { name: 'Formality Level', options: ['Low', 'Medium', 'High'] },
  {
    name: 'Region Dialect',
    options: ['Standard', 'Kansai', 'Tohoku'],
  },
  {
    name: 'Context preset',
    options: ['General', 'Technical', 'Creative'],
  },
  { name: 'Politeness Level', options: ['Low', 'Medium', 'High'] },
  { name: 'Sentence Complexity', options: ['Simple', 'Medium', 'Complex'] },
  { name: 'Translation Style', options: ['Literal', 'Natural'] },
  {
    name: 'Punctuation and Formatting',
    options: ['Standard Japanese', 'Casual Japanese', 'Formal Japanese'],
  },
  { name: 'Pronoun Use', options: ['Neutral', 'Formal', 'Casual'] },
  { name: 'Sentence Structure', options: ['Active Voice', 'Passive Voice'] },
  { name: 'Idiomatic Expression', type: 'switch' },
  { name: 'Redundancy Removal', type: 'switch' },
];

const defaultSettings = advancedSettings.reduce((acc, setting) => {
  acc[setting.name] = ''; // Initialize each setting with an empty string
  return acc;
}, {});
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [userText, setUserText] = useState('');
  const [context, setContext] = useState('');
  const [settings, setSettings] = useState(defaultSettings);
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const languages = ['English', 'Japanese', 'Spanish', 'French', 'German'];
  const aiModels = [
    'GPT-3',
    'GPT-4',
    'DALL-E',
    'Claude',
    'local-uncensored-40b',
  ];
  useEffect(() => {
    console.log(settings);
  }, [settings]);

  useEffect(() => {
    console.log('settings: ', settings);
  }, []);

  const handleSettingChange = (name: string, value: any) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleTranslate = async () => {
    setLoading(true); // Set loading to true when translation starts
    const payload = {
      userText,
      settings: { ...settings, context },
    };

    // Post to route.js (replace with your actual route)
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const { translatedText } = await response.json();
    console.log('hes here: ', translatedText);
    setTranslatedText(JSON.parse(translatedText));
    setLoading(false); // Set loading to false when translation is complete
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Translator</h1>
          <Button variant="secondary">Sign In</Button>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center md:p-4">
        <div className="w-full max-w-4xl bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-wrap md:flex-nowrap gap-2 p-4 justify-between bg-muted">
            <div className="flex gap-2 ">
              {advancedSettings.slice(0, 3).map((setting: any) => (
                <Select
                  key={setting.name}
                  onValueChange={(value) =>
                    handleSettingChange(setting.name, value)
                  }
                >
                  <SelectTrigger className="w-max rounded-2xl">
                    <SelectValue
                      placeholder={settings[setting.name] || setting.name}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {setting.options.map((option: any) => (
                      <SelectItem
                        key={option}
                        value={option.toLowerCase().replace(' ', '-')}
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => handleSettingChange('AIModel', value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="AI Model" />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model} value={model.toLowerCase()}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Advanced
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Advanced Settings</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6 py-4">
                    {advancedSettings.map((setting) => (
                      <div key={setting.name} className="space-y-2">
                        <Label
                          htmlFor={setting.name.toLowerCase().replace(' ', '-')}
                        >
                          {setting.name}
                        </Label>
                        {setting.type === 'switch' ? (
                          <Switch
                            id={setting.name.toLowerCase().replace(' ', '-')}
                            onCheckedChange={(checked) =>
                              handleSettingChange(setting.name, checked)
                            } // Update settings
                            checked={settings[setting.name] === true} // Set checked state based on current value
                          />
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              handleSettingChange(setting.name, value)
                            }
                          >
                            <SelectTrigger
                              id={setting.name.toLowerCase().replace(' ', '-')}
                            >
                              <SelectValue
                                placeholder={settings[setting.name] || 'none'}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options.map((option) => (
                                <SelectItem
                                  key={option}
                                  value={option.toLowerCase().replace(' ', '-')}
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 relative">
            <div className="space-y-4 ">
              <div className="w-full  h-max justify-center items-center flex">
                <h1>English</h1>
              </div>
              <Textarea
                placeholder="Enter text to translate..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                className="h-32"
              />
              <Textarea
                placeholder="Add context (optional)"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="h-24"
              />
              <Button
                variant="default"
                className="w-full"
                onClick={handleTranslate}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span> // Add your spinner here
                ) : (
                  'Translate'
                )}
              </Button>
            </div>
            <div className=" rounded-lg ">
              <div className="w-full h-max justify-center items-center flex ">
                <h1>Japanese</h1>
              </div>
              <div className="  h-full py-4 ">
                <div className="bg-muted rounded-lg h-full  p-4 ">
                  <h2 className="font-semibold mb-2">Translation:</h2>
                  <p className="text-lg">{translatedText.text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted p-4">
        <div className="container mx-auto flex justify-center">
          <Button variant="outline" className="rounded-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        </div>
      </footer>
    </div>
  );
}
