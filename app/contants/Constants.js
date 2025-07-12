import TapIcon from '../assets/icons/tapIcon.svg';
import TemperatureScaleIcon from '../assets/icons/temperatureScale.svg';
import ElectricIcon from '../assets/icons/electric.svg';
import HouseStructureIcon from '../assets/icons/houseStructure.svg';
import SocialIcon from '../assets/icons/social.svg';
import LivingIcon from '../assets/icons/home.svg';

export const CountryCodes = [
  {label: '+1', value: '+1'},
  {label: '+44', value: '+44'},
  {label: '+91', value: '+91'},
  {label: '+61', value: '+61'},
  {label: '+81', value: '+81'},
  {label: '+49', value: '+49'},
  {label: '+33', value: '+33'},
  {label: '+39', value: '+39'},
  {label: '+86', value: '+86'},
  {label: '+7', value: '+7'},
  {label: '+34', value: '+34'},
  {label: '+55', value: '+55'},
  {label: '+31', value: '+31'},
  {label: '+82', value: '+82'},
  {label: '+27', value: '+27'},
  {label: '+46', value: '+46'},
  {label: '+41', value: '+41'},
  {label: '+32', value: '+32'},
  {label: '+52', value: '+52'},
  {label: '+65', value: '+65'},
  {label: '+66', value: '+66'},
  {label: '+20', value: '+20'},
  {label: '+90', value: '+90'},
  {label: '+971', value: '+971'},
];

export const IssueStatus = [
  {
    label: 'Open',
    value: 'open',
  },
  {
    label: 'In Progress',
    value: 'inProgress',
  },
  {
    label: 'Resolved',
    value: 'resolved',
  },
];

export const UserRoles = [
  {
    label: 'Property Owner',
    value: 'propertyOwner',
  },
  {
    label: 'Landloard',
    value: 'landloard',
  },
  {
    label: 'Property Manager',
    value: 'propertyManager',
  },
  {
    label: 'Tanent',
    value: 'tanent',
  },
];

export const priorityColors = {
  urgent: {
    backgroundColor: '#FEE2E2',
    textColor: '#B91C1C',
  },
  high: {
    backgroundColor: '#FEF3C7',
    textColor: '#B45309',
  },
  medium: {
    backgroundColor: '#D1FAE5',
    textColor: '#047857',
  },
};

export const tenancyTypes = [
  {
    label: 'Rental Contract',
    value: 'Rental Contract',
  },
  {
    label: 'Lease Contract',
    value: 'Lease Contract',
  },
];

export const currencyData = [
  {
    label: '£',
    value: '£',
    country: 'United Kingdom',
  },
  {
    label: '$',
    value: '$',
    country: 'United States',
  },
  {
    label: '€',
    value: '€',
    country: 'Germany',
  },
  {
    label: '€',
    value: '€',
    country: 'France',
  },
  {
    label: '€',
    value: '€',
    country: 'Spain',
  },
];

export const countryData = [
  {
    label: 'United Kingdom',
    value: 'United Kingdom',
  },
  {
    label: 'United States',
    value: 'United States',
  },
  {
    label: 'Germany',
    value: 'Germany',
  },
  {
    label: 'France',
    value: 'France',
  },
  {
    label: 'Spain',
    value: 'Spain',
  },
];

export const property = [
  {
    label: 'Appartment',
    value: 'appartment',
  },
  {
    label: 'House',
    value: 'house',
  },
];

export const certificateTypes = [
  {label: 'Gas Safety Certificate', value: 'Gas Safety Certificate'},
  {label: 'EPC Certificate', value: 'EPC Certificate'},
  {label: 'Electrical Certificate', value: 'Electrical Certificate'},
];

export const statusTypes = [
  {label: 'Active', value: 'active'},
  {label: 'Expired', value: 'expired'},
];

export const countData = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
  {label: '5', value: '5'},
];

export const issueTypes = [
  {
    id: 'plumbing',
    title: 'Plumbing',
    subtitle: 'Water & drainage issues',
    icon: <TapIcon width={30} height={30} color="#3B82F6" />,
  },
  {
    id: 'electrical',
    title: 'Electrical',
    subtitle: 'Power & lighting issues',
    icon: <ElectricIcon width={30} height={30} color="#F59E0B" />,
  },
  {
    id: 'structural',
    title: 'Structural',
    subtitle: 'Building, garden & walls issues',
    icon: <HouseStructureIcon width={30} height={30} color="#EF4444" />,
  },
  {
    id: 'hvac',
    title: 'HVAC',
    subtitle: 'Heating & cooling',
    icon: <TemperatureScaleIcon width={30} height={30} color="#10B981" />,
  },
  {
    id: 'social',
    title: 'Social',
    subtitle: 'Social & External',
    icon: <SocialIcon width={30} height={30} color="#059669" />,
  },
  {
    id: 'living',
    title: 'Living',
    subtitle: 'Living, Parking, and External Issues',
    icon: <LivingIcon width={30} height={30} color="#2563EB" />,
  },
];

export const priorities = [
  {
    id: 'critical',
    title: 'Critical',
    description: '24-hour resolution required',
    color: '#DC2626',
  },
  {
    id: 'high',
    title: 'High',
    description: '48-hour resolution required',
    color: '#F59E0B',
  },
  {
    id: 'medium',
    title: 'Medium',
    description: '7-day resolution target',
    color: '#6B7280',
  },
];
