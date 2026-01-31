import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, CalendarIcon, Eye, EyeOff, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { shouldHideTradingCTAs } from '@/lib/featureFlags';
import { useClient } from '@/lib/clientContext';

interface LiveAccountRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PHONE_PREFIXES = [
  { code: '+213', country: 'Algeria' },
  { code: '+376', country: 'Andorra' },
  { code: '+244', country: 'Angola' },
  { code: '+1264', country: 'Anguilla' },
  { code: '+1268', country: 'Antigua & Barbuda' },
  { code: '+54', country: 'Argentina' },
  { code: '+374', country: 'Armenia' },
  { code: '+297', country: 'Aruba' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+1242', country: 'Bahamas' },
  { code: '+973', country: 'Bahrain' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+1246', country: 'Barbados' },
  { code: '+375', country: 'Belarus' },
  { code: '+32', country: 'Belgium' },
  { code: '+501', country: 'Belize' },
  { code: '+229', country: 'Benin' },
  { code: '+1441', country: 'Bermuda' },
  { code: '+975', country: 'Bhutan' },
  { code: '+591', country: 'Bolivia' },
  { code: '+387', country: 'Bosnia Herzegovina' },
  { code: '+267', country: 'Botswana' },
  { code: '+55', country: 'Brazil' },
  { code: '+673', country: 'Brunei' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+257', country: 'Burundi' },
  { code: '+855', country: 'Cambodia' },
  { code: '+237', country: 'Cameroon' },
  { code: '+1', country: 'Canada' },
  { code: '+238', country: 'Cape Verde Islands' },
  { code: '+1345', country: 'Cayman Islands' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+56', country: 'Chile' },
  { code: '+86', country: 'China' },
  { code: '+57', country: 'Colombia' },
  { code: '+269', country: 'Comoros' },
  { code: '+242', country: 'Congo' },
  { code: '+682', country: 'Cook Islands' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+225', country: 'Côte d\'Ivoire' },
  { code: '+385', country: 'Croatia' },
  { code: '+53', country: 'Cuba' },
  { code: '+357', country: 'Cyprus' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45', country: 'Denmark' },
  { code: '+253', country: 'Djibouti' },
  { code: '+1809', country: 'Dominican Republic' },
  { code: '+593', country: 'Ecuador' },
  { code: '+20', country: 'Egypt' },
  { code: '+503', country: 'El Salvador' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+291', country: 'Eritrea' },
  { code: '+372', country: 'Estonia' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+500', country: 'Falkland Islands' },
  { code: '+298', country: 'Faroe Islands' },
  { code: '+679', country: 'Fiji' },
  { code: '+358', country: 'Finland' },
  { code: '+33', country: 'France' },
  { code: '+594', country: 'French Guiana' },
  { code: '+689', country: 'French Polynesia' },
  { code: '+241', country: 'Gabon' },
  { code: '+220', country: 'Gambia' },
  { code: '+995', country: 'Georgia' },
  { code: '+49', country: 'Germany' },
  { code: '+233', country: 'Ghana' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+30', country: 'Greece' },
  { code: '+299', country: 'Greenland' },
  { code: '+1473', country: 'Grenada' },
  { code: '+590', country: 'Guadeloupe' },
  { code: '+671', country: 'Guam' },
  { code: '+502', country: 'Guatemala' },
  { code: '+224', country: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+592', country: 'Guyana' },
  { code: '+509', country: 'Haiti' },
  { code: '+504', country: 'Honduras' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36', country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+91', country: 'India' },
  { code: '+62', country: 'Indonesia' },
  { code: '+98', country: 'Iran' },
  { code: '+964', country: 'Iraq' },
  { code: '+353', country: 'Ireland' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italy' },
  { code: '+1876', country: 'Jamaica' },
  { code: '+81', country: 'Japan' },
  { code: '+962', country: 'Jordan' },
  { code: '+254', country: 'Kenya' },
  { code: '+686', country: 'Kiribati' },
  { code: '+850', country: 'Korea North' },
  { code: '+82', country: 'Korea South' },
  { code: '+965', country: 'Kuwait' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+856', country: 'Laos' },
  { code: '+371', country: 'Latvia' },
  { code: '+961', country: 'Lebanon' },
  { code: '+266', country: 'Lesotho' },
  { code: '+231', country: 'Liberia' },
  { code: '+218', country: 'Libya' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+370', country: 'Lithuania' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+853', country: 'Macao' },
  { code: '+389', country: 'Macedonia' },
  { code: '+261', country: 'Madagascar' },
  { code: '+265', country: 'Malawi' },
  { code: '+60', country: 'Malaysia' },
  { code: '+960', country: 'Maldives' },
  { code: '+223', country: 'Mali' },
  { code: '+356', country: 'Malta' },
  { code: '+692', country: 'Marshall Islands' },
  { code: '+596', country: 'Martinique' },
  { code: '+222', country: 'Mauritania' },
  { code: '+52', country: 'Mexico' },
  { code: '+691', country: 'Micronesia' },
  { code: '+373', country: 'Moldova' },
  { code: '+377', country: 'Monaco' },
  { code: '+976', country: 'Mongolia' },
  { code: '+1664', country: 'Montserrat' },
  { code: '+212', country: 'Morocco' },
  { code: '+258', country: 'Mozambique' },
  { code: '+95', country: 'Myanmar' },
  { code: '+264', country: 'Namibia' },
  { code: '+674', country: 'Nauru' },
  { code: '+977', country: 'Nepal' },
  { code: '+31', country: 'Netherlands' },
  { code: '+687', country: 'New Caledonia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+227', country: 'Niger' },
  { code: '+234', country: 'Nigeria' },
  { code: '+683', country: 'Niue' },
  { code: '+672', country: 'Norfolk Islands' },
  { code: '+670', country: 'Northern Marianas' },
  { code: '+47', country: 'Norway' },
  { code: '+968', country: 'Oman' },
  { code: '+92', country: 'Pakistan' },
  { code: '+680', country: 'Palau' },
  { code: '+507', country: 'Panama' },
  { code: '+675', country: 'Papua New Guinea' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Peru' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+1787', country: 'Puerto Rico' },
  { code: '+974', country: 'Qatar' },
  { code: '+262', country: 'Reunion' },
  { code: '+40', country: 'Romania' },
  { code: '+7', country: 'Russia' },
  { code: '+250', country: 'Rwanda' },
  { code: '+378', country: 'San Marino' },
  { code: '+239', country: 'Sao Tome & Principe' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+221', country: 'Senegal' },
  { code: '+381', country: 'Serbia' },
  { code: '+248', country: 'Seychelles' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+65', country: 'Singapore' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+677', country: 'Solomon Islands' },
  { code: '+252', country: 'Somalia' },
  { code: '+27', country: 'South Africa' },
  { code: '+34', country: 'Spain' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+290', country: 'St. Helena' },
  { code: '+1869', country: 'St. Kitts' },
  { code: '+1758', country: 'St. Lucia' },
  { code: '+249', country: 'Sudan' },
  { code: '+597', country: 'Suriname' },
  { code: '+268', country: 'Swaziland' },
  { code: '+46', country: 'Sweden' },
  { code: '+41', country: 'Switzerland' },
  { code: '+963', country: 'Syria' },
  { code: '+886', country: 'Taiwan' },
  { code: '+66', country: 'Thailand' },
  { code: '+228', country: 'Togo' },
  { code: '+676', country: 'Tonga' },
  { code: '+1868', country: 'Trinidad & Tobago' },
  { code: '+216', country: 'Tunisia' },
  { code: '+90', country: 'Turkey' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+1649', country: 'Turks & Caicos Islands' },
  { code: '+688', country: 'Tuvalu' },
  { code: '+256', country: 'Uganda' },
  { code: '+44', country: 'UK' },
  { code: '+380', country: 'Ukraine' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+598', country: 'Uruguay' },
  { code: '+678', country: 'Vanuatu' },
  { code: '+379', country: 'Vatican City' },
  { code: '+58', country: 'Venezuela' },
  { code: '+84', country: 'Vietnam' },
  { code: '+1284', country: 'Virgin Islands - British' },
  { code: '+1340', country: 'Virgin Islands - US' },
  { code: '+681', country: 'Wallis & Futuna' },
  { code: '+969', country: 'Yemen (North)' },
  { code: '+967', country: 'Yemen (South)' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
];

const COUNTRIES = [
  'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla',
  'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso',
  'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic',
  'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Korea North', 'Korea South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
  'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Password validation helper
const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return {
    isValid: hasMinLength && hasUpperCase && hasSpecialChar,
    hasMinLength,
    hasUpperCase,
    hasSpecialChar,
  };
};

export function LiveAccountRegistrationModal({ open, onOpenChange }: LiveAccountRegistrationModalProps) {
  const { profile, user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>();
  const [passwordOption, setPasswordOption] = useState<'app' | 'custom'>('app');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    phonePrefix: '',
    phone: '',
    password: '',
    passwordVerification: '',
    // Step 2
    citizenship: '',
    country: '',
    zip: '',
    city: '',
    street: '',
    street2: '',
    promocode: '',
    platformCurrency: 'USD',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form with existing user data
  useEffect(() => {
    if (profile || user) {
      setFormData(prev => ({
        ...prev,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || '',
      }));
    }
  }, [profile, user]);

  // Handle birthday date change
  useEffect(() => {
    if (birthdayDate) {
      setFormData(prev => ({
        ...prev,
        birthday: format(birthdayDate, 'yyyy-MM-dd'),
      }));
      if (errors.birthday) {
        setErrors(prev => ({ ...prev, birthday: '' }));
      }
    }
  }, [birthdayDate]);

  // Handle password option change
  useEffect(() => {
    if (passwordOption === 'app') {
      // Use a placeholder for app password - in real scenario this would be fetched
      // For now we'll use a secure generated password pattern
      const appPassword = 'AppSecure123!';
      setFormData(prev => ({
        ...prev,
        password: appPassword,
        passwordVerification: appPassword,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        password: '',
        passwordVerification: '',
      }));
    }
  }, [passwordOption]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const passwordValidation = validatePassword(formData.password);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Surname is required';
    if (!formData.birthday) newErrors.birthday = 'Birthday is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phonePrefix) newErrors.phonePrefix = 'Phone prefix is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }
    
    if (formData.password !== formData.passwordVerification) {
      newErrors.passwordVerification = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.citizenship) newErrors.citizenship = 'Citizenship is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!termsAccepted) newErrors.terms = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        email: formData.email,
        phonePrefix: formData.phonePrefix,
        phone: formData.phone,
        password: formData.password,
        citizenship: formData.citizenship,
        country: formData.country,
        zip: formData.zip,
        city: formData.city,
        street: formData.street,
        street2: formData.street2,
        promocode: formData.promocode,
        platformCurrency: formData.platformCurrency,
        fullPhone: `${formData.phonePrefix}${formData.phone}`,
        submittedAt: new Date().toISOString(),
        userId: user?.id,
      };

      console.log('Submitting registration:', payload);

      const response = await fetch('https://clientee.app.n8n.cloud/webhook-test/42042989-a121-42aa-8d52-a616e839a923', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        toast.success('Registration submitted successfully!');
        onOpenChange(false);
        setStep(1);
        setTermsAccepted(false);
        setBirthdayDate(undefined);
        setPasswordOption('app');
      } else {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { client } = useClient();
  
  // Hide entire modal when trading CTAs are disabled for App Store compliance (non-NASR clients)
  if (shouldHideTradingCTAs(client?.subdomain)) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{step}</span>
            </div>
            Live Account Registration
          </DialogTitle>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Step {step} of 2: {step === 1 ? 'Personal Details' : 'Address & Verification'}
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Personal Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Surname *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>

              {/* Birthday with Date Picker */}
              <div className="space-y-2">
                <Label>Birthday *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !birthdayDate && "text-muted-foreground",
                        errors.birthday && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthdayDate ? format(birthdayDate, "PPP") : <span>Pick your birthday</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthdayDate}
                      onSelect={setBirthdayDate}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      captionLayout="dropdown-buttons"
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.birthday && <p className="text-xs text-destructive">{errors.birthday}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Phone Prefix *</Label>
                  <Select value={formData.phonePrefix} onValueChange={(v) => handleInputChange('phonePrefix', v)}>
                    <SelectTrigger className={errors.phonePrefix ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {PHONE_PREFIXES.map((p) => (
                        <SelectItem key={p.code + p.country} value={p.code}>
                          {p.country} ({p.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.phonePrefix && <p className="text-xs text-destructive">{errors.phonePrefix}</p>}
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              {/* Password Option Selection */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                <Label className="text-base font-medium">Password *</Label>
                
                <RadioGroup value={passwordOption} onValueChange={(v) => setPasswordOption(v as 'app' | 'custom')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app" id="app-password" />
                    <label htmlFor="app-password" className="text-sm cursor-pointer">
                      Use app password (same as your login)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom-password" />
                    <label htmlFor="custom-password" className="text-sm cursor-pointer">
                      Choose a different password
                    </label>
                  </div>
                </RadioGroup>

                {/* Password Requirements Info */}
                <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-md border border-primary/20">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Password Requirements:</p>
                    <ul className="space-y-0.5">
                      <li className={passwordValidation.hasMinLength ? 'text-green-500' : ''}>
                        • At least 12 characters
                      </li>
                      <li className={passwordValidation.hasUpperCase ? 'text-green-500' : ''}>
                        • At least 1 capital letter (A-Z)
                      </li>
                      <li className={passwordValidation.hasSpecialChar ? 'text-green-500' : ''}>
                        • At least 1 special character (!@#$%^&*...)
                      </li>
                    </ul>
                  </div>
                </div>

                {passwordOption === 'custom' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={cn("pr-10", errors.password ? 'border-destructive' : '')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordVerification">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="passwordVerification"
                          type={showPasswordVerification ? 'text' : 'password'}
                          value={formData.passwordVerification}
                          onChange={(e) => handleInputChange('passwordVerification', e.target.value)}
                          className={cn("pr-10", errors.passwordVerification ? 'border-destructive' : '')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswordVerification(!showPasswordVerification)}
                        >
                          {showPasswordVerification ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.passwordVerification && <p className="text-xs text-destructive">{errors.passwordVerification}</p>}
                    </div>
                  </div>
                )}

                {passwordOption === 'app' && (
                  <div className="mt-2 p-3 bg-green-500/10 rounded-md border border-green-500/20">
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Using your app password
                    </p>
                  </div>
                )}
              </div>

              <Button onClick={handleNextStep} className="w-full mt-6" size="lg">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Address & Verification</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Citizenship *</Label>
                  <Select value={formData.citizenship} onValueChange={(v) => handleInputChange('citizenship', v)}>
                    <SelectTrigger className={errors.citizenship ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.citizenship && <p className="text-xs text-destructive">{errors.citizenship}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={formData.country} onValueChange={(v) => handleInputChange('country', v)}>
                    <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP *</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    className={errors.zip ? 'border-destructive' : ''}
                  />
                  {errors.zip && <p className="text-xs text-destructive">{errors.zip}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Street *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={errors.street ? 'border-destructive' : ''}
                />
                {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street2">Street 2 (Optional)</Label>
                <Input
                  id="street2"
                  value={formData.street2}
                  onChange={(e) => handleInputChange('street2', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promocode">Promocode (Optional)</Label>
                  <Input
                    id="promocode"
                    value={formData.promocode}
                    onChange={(e) => handleInputChange('promocode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform Currency</Label>
                  <Input value="USD" disabled className="bg-muted" />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked as boolean);
                      if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I confirm the reliability of the information. I have read, understood and accepted the{' '}
                    <span className="text-primary">Privacy Policy</span>,{' '}
                    <span className="text-primary">Risk Disclosure</span>,{' '}
                    <span className="text-primary">Terms & Conditions</span>,{' '}
                    <span className="text-primary">Order Execution Policy</span>,{' '}
                    <span className="text-primary">Conflicts of Interest Policy</span>,{' '}
                    <span className="text-primary">Leverage and Margin Policy</span>,{' '}
                    <span className="text-primary">Key Information Documents</span>,{' '}
                    <span className="text-primary">Complaints Handling Policy</span>,{' '}
                    <span className="text-primary">Investor Compensation Fund Policy</span>,{' '}
                    <span className="text-primary">Deposit, Withdrawal & Refund Policy</span>,{' '}
                    <span className="text-primary">Client Categorization Policy</span>,{' '}
                    <span className="text-primary">Cookies Disclaimer</span>.
                  </label>
                </div>
                {errors.terms && <p className="text-xs text-destructive mt-2">{errors.terms}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 w-4 h-4" /> Submit Registration
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
              <p>
                The company NASR TRADE Ltd was formed in Mauritius under the Limited Liability Companies with licence number GB23202226.
              </p>
              <p>
                Triangleview Investments LTD with Registration number and CYSEC licence number 384/20 is acting as a payment agent (custodian) of Nasr Trade Ltd. Triangleview Investments LTD is an investment firm regulated by CYSEC with number 384/20 and is legally offering the services of reception and transmission of financial instruments, execution of behalf of the client investment services as well as the ancillary of service of clients safekeeping to Nasr Trade LTD. Therefore it can act as a custodian and payment agent of Nasr Trade LTD.
              </p>
              <p>
                Trading Foreign Exchange (Forex) and Contracts for Differences (CFD's) is highly speculative, carries a high level of risk and may not be suitable for all investors. You may sustain a loss of some or all of your invested capital, therefore, you should not speculate with capital that you cannot afford to lose. You should be aware of all the risks associated with trading on margin.
              </p>
              <p>
                This website is marketed and operated by Nasr Trade LTD and is located at C/o ANIMO ASSOCIATES (MAURITIUS) LIMITED, 8th Floor, The Core, 62 ICT Avenue, Cybercity, Ebene 72201, Mauritius. Restricted Jurisdictions: We do not establish accounts to residents of certain jurisdictions including the USA, Japan, North Korea, Iran, the EU and the EEA. For further details please see Terms & Conditions.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
