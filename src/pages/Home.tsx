import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, PawPrint, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import SupportBlock from '../components/SupportBlock';

// Default scat image path
const DEFAULT_IMAGE = "/default-scat.jpg";

// Default analysis for the animal scat
const DEFAULT_ANALYSIS = `1. Scat Identification:
- Animal: Deer (Odocoileus species)
- Type: Pellet droppings
- Appearance: Small, oval-shaped pellets, dark brown to black in color
- Size: Approximately 0.5-0.75 inches (1.3-1.9 cm) in length
- Distinguishing Features: Clustered pellet formation, pointed on one end

2. Habitat & Distribution:
- Natural Habitat: Forests, meadows, grasslands, agricultural areas
- Geographic Range: Throughout North America
- Seasonal Variation: More concentrated in winter when food is scarce
- Typical Location: Often found on game trails, feeding areas, and bedding sites
- Elevation Range: From sea level to mountainous regions (up to 10,000 feet)

3. Biology & Behavior:
- Diet Indicators: Plant matter visible, indicating herbivorous diet
- Health Assessment: Well-formed, indicating healthy digestion
- Seasonal Behavior: Pellet size and composition varies by season based on diet
- Territorial Significance: Not used for territorial marking
- Population Density: Clustered droppings may indicate higher population density

4. Wildlife Research Value:
- Research Applications: Population surveys, diet analysis, health monitoring
- Conservation Relevance: Can indicate habitat use and population health
- Tracking Value: Fresh droppings indicate recent presence (within 24-48 hours)
- DNA Sampling: Can be used for genetic analysis and population studies
- Disease Monitoring: Can be screened for parasites and pathogens

5. Additional Information:
- Similar Species: Can be confused with rabbit droppings (rounder, larger)
- Interesting Facts: Deer pellet count techniques are used to estimate population
- Field Identification Tips: Deer scat is typically found in clusters of 50-75 pellets
- Ecological Role: Contributes to seed dispersal and nutrient cycling
- Safety Notes: Generally low risk, but always wash hands after handling any wildlife scat`;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load default image and analysis without API call
    const loadDefaultContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEFAULT_IMAGE);
        if (!response.ok) {
          throw new Error('Failed to load default image');
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImage(base64data);
          setAnalysis(DEFAULT_ANALYSIS);
          setLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to load default image');
          setLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading default image:', err);
        setError('Failed to load default image');
        setLoading(false);
      }
    };

    loadDefaultContent();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setError(null);
      handleAnalyze(base64String);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);

    // Reset the file input so the same file can be selected again
    e.target.value = '';
  }, []);

  const handleAnalyze = async (imageData: string) => {
    setLoading(true);
    setError(null);
    const scatPrompt = "Analyze this animal scat/droppings image for educational purposes and provide the following information:\n1. Scat identification (animal species, type, appearance, size, distinguishing features)\n2. Habitat and distribution (natural habitat, geographic range, seasonal variation, typical locations)\n3. Biology and behavior (diet indicators, health assessment, seasonal behavior, territorial significance)\n4. Wildlife research value (research applications, conservation relevance, tracking value, DNA sampling)\n5. Additional information (similar species, interesting facts, field identification tips, ecological role)\n\nIMPORTANT: This is for educational purposes only.";
    try {
      const result = await analyzeImage(imageData, scatPrompt);
      setAnalysis(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Remove any markdown-style formatting
      const cleanLine = line.replace(/[*_#`]/g, '').trim();
      if (!cleanLine) return null;

      // Format section headers (lines starting with numbers)
      if (/^\d+\./.test(cleanLine)) {
        return (
          <div key={index} className="mt-8 first:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {cleanLine.replace(/^\d+\.\s*/, '')}
            </h3>
          </div>
        );
      }
      
      // Format list items with specific properties
      if (cleanLine.startsWith('-') && cleanLine.includes(':')) {
        const [label, ...valueParts] = cleanLine.substring(1).split(':');
        const value = valueParts.join(':').trim();
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="font-semibold text-gray-800 min-w-[120px]">{label.trim()}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      }
      
      // Format regular list items
      if (cleanLine.startsWith('-')) {
        return (
          <div key={index} className="flex gap-2 mb-3 ml-4">
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }

      // Regular text
      return (
        <p key={index} className="mb-3 text-gray-700">
          {cleanLine}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div className="bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Free Scat Identifier</h1>
          <p className="text-base sm:text-lg text-gray-600">Upload a scat photo for educational wildlife identification and animal information</p>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Upload className="h-5 w-5" />
              Upload Scat Photo
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP (MAX. 20MB)</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && !image && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-green-600" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {image && (
            <div className="mb-6">
              <div className="relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Scat preview"
                  className="w-full h-auto max-h-[500px] object-contain mx-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnalyze(image)}
                  disabled={loading}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <PawPrint className="-ml-1 mr-2 h-5 w-5" />
                      Identify Scat
                    </>
                  )}
                </button>
                <button
                  onClick={triggerFileInput}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Another Photo
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Scat Analysis Results</h2>
              <div className="text-gray-700">
                {formatAnalysis(analysis)}
              </div>
            </div>
          )}
        </div>

        <SupportBlock />

        <div className="prose max-w-none my-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Free Scat Identifier: Your Educational Guide to Wildlife Tracking</h2>
          
          <p>Welcome to our free scat identifier tool, powered by advanced artificial intelligence technology.
             This educational tool helps you learn about different animal species through their droppings,
             providing essential information about wildlife behavior, diet, and habitat preferences.</p>

          <h3>How Our Educational Scat Identifier Works</h3>
          <p>Our tool uses AI to analyze animal droppings photos and provide educational information about species
             identification, habitat details, and biological attributes. Simply upload a clear photo of animal scat,
             and our AI will help you learn about the animal that left it behind.</p>

          <h3>Key Features of Our Scat Identifier</h3>
          <ul>
            <li>Educational wildlife biology information</li>
            <li>Detailed habitat and distribution data</li>
            <li>Diet and behavior insights from scat analysis</li>
            <li>Wildlife tracking and research information</li>
            <li>Field identification guidelines</li>
            <li>100% free to use</li>
          </ul>

          <h3>Perfect For Learning About:</h3>
          <ul>
            <li>Wildlife tracking and identification skills</li>
            <li>Animal diet and health indicators</li>
            <li>Habitat use and territorial behavior</li>
            <li>Seasonal animal movement patterns</li>
            <li>Wildlife biology and conservation research methods</li>
          </ul>

          <p>Try our free scat identifier today and expand your knowledge of wildlife tracking!
             No registration required - just upload a photo and start learning about fascinating animal species from around the world.</p>
        </div>

        <SupportBlock />
      </div>
    </div>
  );
}