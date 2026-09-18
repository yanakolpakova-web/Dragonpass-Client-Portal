import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a7282]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#e5e7eb] text-[13px] font-['Cabin',sans-serif] text-[#0a2333] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0a2333] bg-[#f9fafb]"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#0a2333] transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
