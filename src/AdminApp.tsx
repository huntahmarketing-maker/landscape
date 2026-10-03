import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Mail,
  MessageSquare,
  Search,
  Settings,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Section = 'dashboard' | 'appointments' | 'inquiries' | 'quotes' | 'settings';
type RecordType = 'appointment' | 'inquiry' | 'quote';
type AppointmentStatus = 'New' | 'Confirmed' | 'Completed' | 'Cancelled';
type InquiryStatus = 'New' | 'Contacted' | 'Closed';
type QuoteStatus = 'New' | 'Contacted' | 'Estimate Scheduled' | 'Quote Sent' | 'Won' | 'Lost';

type Appointment = {
  id: string; customer_name: string; email: string; phone: string; address: string; service: string;
  appointment_date: string | null; appointment_time: string | null; notes: string; submitted_at: string;
  status: AppointmentStatus; admin_notes: string;
};
type Inquiry = {
  id: string; customer_name: string; email: string; phone: string; message: string; submitted_at: string;
  status: InquiryStatus; admin_notes: string;
};
type QuoteRequest = {
  id: string; customer_name: string; email: string; phone: string; address: string; service: string;
  project_details: string; message: string; submitted_at: string; status: QuoteStatus; admin_notes: string;
};

type SelectedRecord = { type: RecordType; id: string } | null;

const appointmentStatuses: AppointmentStatus[] = ['New', 'Confirmed', 'Completed', 'Cancelled'];
const inquiryStatuses: InquiryStatus[] = ['New', 'Contacted', 'Closed'];
const quoteStatuses: QuoteStatus[] = ['New', 'Contacted', 'Estimate Scheduled', 'Quote Sent', 'Won', 'Lost'];

const SESSION_KEY = 'dma_admin_session';

function formatDate(value: string | null) {
  if (!value) return 'Not specified';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(`${value}T12:00:00`));
}

function formatSubmitted(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function getToken(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

function setToken(token: string) {
  sessionStorage.setItem(SESSION_KEY, token);
}

function clearToken() {
  sessionStorage.removeItem(SESSION_KEY);
}

function AdminLogin({ onAuth }: { onAuth: (token: string, username: string) => void }) {
  const [mode, setMode] = useState<'loading' | 'login' | 'register'>('loading');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setMode('login');
      return;
    }
    supabase.rpc('admin_exists').then(({ data }: { data: unknown }) => {
      setMode(data === true || data === true ? 'login' : 'register');
    });
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setError('Database is not configured.');
      return;
    }
    setSending(true);
    setError('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('The two passwords do not match.');
        setSending(false);
        return;
      }
      const { data, error: rpcError } = await supabase.rpc('admin_register', {
        p_username: username.trim(),
        p_password: password,
      });
      if (rpcError || !data) {
        setError('Could not create the admin account. Please try again.');
        setSending(false);
        return;
      }
      const token = data as string;
      setToken(token);
      onAuth(token, username.trim());
      setSending(false);
      return;
    }

    const { data, error: rpcError } = await supabase.rpc('admin_login', {
      p_username: username.trim(),
      p_password: password,
    });
    if (rpcError || !data) {
      setError('The username or password is not recognized.');
      setSending(false);
      return;
    }
    const token = data as string;
    setToken(token);
    onAuth(token, username.trim());
    setSending(false);
  };

  return <main className="flex min-h-screen items-center justify-center bg-forest px-5 py-12 text-white">
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime text-forest"><ShieldAlert size={26} /></div>
      <p className="eyebrow mt-8 text-lime">Private workspace</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">DMA admin portal</h1>
      {mode === 'loading' ? <div className="mt-8 flex items-center gap-3 text-mist"><LoaderCircle className="animate-spin" size={20} /> Checking setup…</div> : <>
        <p className="mt-4 leading-7 text-mist">{mode === 'register' ? 'Create your administrator account. This can only be done once.' : 'Sign in with your administrator username and password.'}</p>
        <form onSubmit={submit} className="mt-8 grid gap-5">
          <label className="field text-white">Admin username<input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" /></label>
          <label className="field text-white">Password<input type="password" required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'} /></label>
          {mode === 'register' && <label className="field text-white">Confirm password<input type="password" required autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter password" /></label>}
          {error && <p className="text-sm font-semibold text-lime">{error}</p>}
          <button disabled={sending || !supabase} className="rounded-full bg-lime px-5 py-4 font-bold text-forest transition hover:bg-white disabled:cursor-wait disabled:opacity-60">{sending ? 'Please wait…' : mode === 'register' ? 'Create admin account' : 'Sign in'} <ChevronRight className="ml-2 inline" size={17} /></button>
        </form>
      </>}
    </div>
  </main>;
}

function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [section, setSection] = useState<Section>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selected, setSelected] = useState<SelectedRecord>(null);
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = getToken();
    if (!stored || !supabase) {
      setCheckingSession(false);
      return;
    }
    supabase.rpc('admin_verify_session', { p_token: stored }).then(({ data }: { data: unknown }) => {
      if (data && typeof data === 'string') {
        setToken(stored);
        setUsername(data);
      } else {
        clearToken();
      }
      setCheckingSession(false);
    });
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase || !token) return;
    setLoadingData(true);
    setError('');
    const [apptRes, inqRes, quoteRes] = await Promise.all([
      supabase.rpc('admin_list_appointments', { p_token: token }),
      supabase.rpc('admin_list_inquiries', { p_token: token }),
      supabase.rpc('admin_list_quote_requests', { p_token: token }),
    ]);
    if (apptRes.error || inqRes.error || quoteRes.error) {
      if (apptRes.error?.message.includes('Not authenticated') || inqRes.error?.message.includes('Not authenticated') || quoteRes.error?.message.includes('Not authenticated')) {
        clearToken();
        setToken(null);
        return;
      }
      setError('We could not load the dashboard data. Please refresh and try again.');
    } else {
      setAppointments((apptRes.data ?? []) as Appointment[]);
      setInquiries((inqRes.data ?? []) as Inquiry[]);
      setQuotes((quoteRes.data ?? []) as QuoteRequest[]);
    }
    setLoadingData(false);
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateRecord = async (type: RecordType, id: string, values: { status?: string; admin_notes?: string }) => {
    if (!supabase || !token) return;
    const rpcName = type === 'appointment' ? 'admin_update_appointment' : type === 'inquiry' ? 'admin_update_inquiry' : 'admin_update_quote_request';
    const { error: rpcError } = await supabase.rpc(rpcName, {
      p_token: token,
      p_id: id,
      p_status: values.status ?? '',
      p_admin_notes: values.admin_notes ?? '',
    });
    if (rpcError) {
      setError('That change could not be saved. Please try again.');
      return;
    }
    await loadData();
  };

  const deleteRecord = async (type: RecordType, id: string) => {
    if (!supabase || !token || !window.confirm('Delete this request permanently?')) return;
    const rpcName = type === 'appointment' ? 'admin_delete_appointment' : type === 'inquiry' ? 'admin_delete_inquiry' : 'admin_delete_quote_request';
    const { error: rpcError } = await supabase.rpc(rpcName, { p_token: token, p_id: id });
    if (rpcError) {
      setError('That request could not be deleted. Please try again.');
      return;
    }
    setSelected(null);
    await loadData();
  };

  const handleLogout = async () => {
    if (supabase && token) {
      await supabase.rpc('admin_logout', { p_token: token });
    }
    clearToken();
    setToken(null);
  };

  const filteredAppointments = useMemo(() => appointments.filter((item) => `${item.customer_name} ${item.email} ${item.service} ${item.address}`.toLowerCase().includes(search.toLowerCase())), [appointments, search]);
  const filteredInquiries = useMemo(() => inquiries.filter((item) => `${item.customer_name} ${item.email} ${item.message}`.toLowerCase().includes(search.toLowerCase())), [inquiries, search]);
  const filteredQuotes = useMemo(() => quotes.filter((item) => `${item.customer_name} ${item.email} ${item.service} ${item.project_details}`.toLowerCase().includes(search.toLowerCase())), [quotes, search]);

  if (checkingSession) return <div className="flex min-h-screen items-center justify-center bg-sand text-forest"><LoaderCircle className="animate-spin" /></div>;
  if (!token) return <AdminLogin onAuth={(t, u) => { setToken(t); setUsername(u); }} />;

  const selectedRecord = selected?.type === 'appointment' ? appointments.find((item) => item.id === selected.id) : selected?.type === 'inquiry' ? inquiries.find((item) => item.id === selected.id) : selected?.type === 'quote' ? quotes.find((item) => item.id === selected.id) : null;
  const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'inquiries', label: 'Chats', icon: MessageSquare }, { id: 'quotes', label: 'Quote requests', icon: FileText }, { id: 'settings', label: 'Settings', icon: Settings },
  ];
  const openRecord = (type: RecordType, id: string) => setSelected({ type, id });

  return <div className="min-h-screen bg-sand text-forest lg:flex">
    <aside className="flex w-full shrink-0 flex-col bg-forest p-5 text-white lg:min-h-screen lg:w-72 lg:p-7">
      <a href="/" className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime font-display text-xl text-forest">D</div><div><p className="font-display text-xl">DMA</p><p className="text-[10px] uppercase tracking-[.2em] text-mist">Admin portal</p></div></a>
      <nav className="mt-9 flex gap-2 overflow-x-auto lg:grid">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setSearch(''); }} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${section === id ? 'bg-lime text-forest' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon size={17} />{label}</button>)}</nav>
      <button onClick={handleLogout} className="mt-auto hidden items-center gap-3 px-4 py-3 text-sm font-semibold text-white/65 hover:text-white lg:flex"><LogOut size={17} />Log out</button>
    </aside>
    <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-forest/10 pb-7 sm:flex-row sm:items-end"><div><p className="eyebrow">DMA Landscaping</p><h1 className="mt-2 font-display text-4xl tracking-tight">{section === 'dashboard' ? 'Good morning.' : navItems.find((item) => item.id === section)?.label}</h1></div>{section !== 'dashboard' && section !== 'settings' && <label className="relative block sm:w-72"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-olive" size={17} /><input className="w-full rounded-full border border-forest/10 bg-white py-3 pl-11 pr-4 text-sm" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests" /></label>}</div>
        {error && <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"><span>{error}</span><button onClick={() => setError('')}><X size={17} /></button></div>}
        {loadingData ? <div className="flex min-h-64 items-center justify-center"><LoaderCircle className="animate-spin text-olive" /></div> : section === 'dashboard' ? <Dashboard appointments={appointments} inquiries={inquiries} quotes={quotes} onOpen={openRecord} /> : section === 'appointments' ? <RequestList type="appointment" items={filteredAppointments} onOpen={openRecord} /> : section === 'inquiries' ? <RequestList type="inquiry" items={filteredInquiries} onOpen={openRecord} /> : section === 'quotes' ? <RequestList type="quote" items={filteredQuotes} onOpen={openRecord} /> : <SettingsPanel username={username} />}
      </div>
    </main>
    {selected && selectedRecord && <DetailPanel type={selected.type} record={selectedRecord} onClose={() => setSelected(null)} onUpdate={updateRecord} onDelete={deleteRecord} />}
  </div>;
}

function Dashboard({ appointments, inquiries, quotes, onOpen }: { appointments: Appointment[]; inquiries: Inquiry[]; quotes: QuoteRequest[]; onOpen: (type: RecordType, id: string) => void }) {
  const upcoming = appointments.filter((item) => item.appointment_date && item.status !== 'Cancelled' && item.status !== 'Completed' && item.appointment_date >= new Date().toISOString().slice(0, 10));
  const cards = [
    ['New appointments', appointments.filter((item) => item.status === 'New').length, CalendarDays, 'appointment'], ['Upcoming appointments', upcoming.length, CalendarDays, 'appointment'],
    ['New chats', inquiries.filter((item) => item.status === 'New').length, MessageSquare, 'inquiry'], ['New quote requests', quotes.filter((item) => item.status === 'New').length, FileText, 'quote'],
    ['Total appointments', appointments.length, ClipboardList, 'appointment'], ['Total leads / requests', inquiries.length + quotes.length, Mail, 'inquiry'],
  ] as const;
  return <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, Icon, type]) => <button key={label} onClick={() => onOpen(type, type === 'appointment' ? appointments[0]?.id : type === 'inquiry' ? inquiries[0]?.id : quotes[0]?.id)} className="rounded-2xl border border-forest/10 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-lime hover:shadow-lg"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/35 text-forest"><Icon size={21} /></div><ChevronRight className="text-olive" size={18} /></div><p className="mt-7 text-sm text-olive">{label}</p><p className="mt-1 font-display text-4xl">{value}</p></button>)}</div>;
}

function RequestList({ type, items, onOpen }: { type: RecordType; items: (Appointment | Inquiry | QuoteRequest)[]; onOpen: (type: RecordType, id: string) => void }) {
  return <div className="mt-8 overflow-hidden rounded-2xl border border-forest/10 bg-white">{items.length === 0 ? <div className="p-12 text-center"><p className="font-display text-2xl">Nothing here yet.</p><p className="mt-2 text-sm text-olive">New customer requests will appear here automatically.</p></div> : <div className="divide-y divide-forest/10">{items.map((item) => <button key={item.id} onClick={() => onOpen(type, item.id)} className="grid w-full gap-3 px-5 py-5 text-left transition hover:bg-cream sm:grid-cols-[1fr_1fr_auto] sm:items-center"><div><p className="font-semibold">{item.customer_name}</p><p className="mt-1 text-sm text-olive">{item.email}</p></div><div><p className="text-sm">{'project_details' in item ? item.project_details : 'service' in item ? item.service : item.message}</p><p className="mt-1 text-xs text-olive">{formatSubmitted(item.submitted_at)}</p></div><span className="w-fit rounded-full bg-lime/35 px-3 py-1 text-xs font-bold">{item.status}</span></button>)}</div>}</div>;
}

function DetailPanel({ type, record, onClose, onUpdate, onDelete }: { type: RecordType; record: Appointment | Inquiry | QuoteRequest; onClose: () => void; onUpdate: (type: RecordType, id: string, values: { status?: string; admin_notes?: string }) => Promise<void>; onDelete: (type: RecordType, id: string) => Promise<void> }) {
  const [notes, setNotes] = useState(record.admin_notes);
  const statuses = type === 'appointment' ? appointmentStatuses : type === 'inquiry' ? inquiryStatuses : quoteStatuses;
  return <div className="fixed inset-0 z-50 flex justify-end bg-forest/60 backdrop-blur-sm"><aside className="h-full w-full max-w-xl overflow-y-auto bg-sand p-6 shadow-2xl sm:p-9"><div className="flex items-start justify-between"><div><p className="eyebrow">Request details</p><h2 className="mt-2 font-display text-4xl">{record.customer_name}</h2><p className="mt-2 text-sm text-olive">Received {formatSubmitted(record.submitted_at)}</p></div><button onClick={onClose} className="rounded-full border border-forest/10 p-2 text-olive hover:bg-white" aria-label="Close details"><X size={20} /></button></div><div className="mt-8 grid gap-5 rounded-2xl border border-forest/10 bg-white p-6 text-sm"><a className="font-semibold hover:text-olive" href={`mailto:${record.email}`}>{record.email}</a>{record.phone && <a className="font-semibold hover:text-olive" href={`tel:${record.phone}`}>{record.phone}</a>}{'address' in record && record.address && <p>{record.address}</p>}{'service' in record && <p><strong>Service:</strong> {record.service}</p>}{'appointment_date' in record && <><p><strong>Date:</strong> {formatDate(record.appointment_date)}</p><p><strong>Time:</strong> {record.appointment_time || 'Not specified'}</p><p className="whitespace-pre-wrap"><strong>Notes:</strong> {record.notes}</p></>}{'project_details' in record && <><p className="whitespace-pre-wrap"><strong>Project details:</strong> {record.project_details}</p><p className="whitespace-pre-wrap"><strong>Message:</strong> {record.message}</p></>}{'message' in record && <p className="whitespace-pre-wrap"><strong>Message:</strong> {record.message}</p>}</div><div className="mt-7 grid gap-5"><label className="field">Status<select value={record.status} onChange={(event) => onUpdate(type, record.id, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className="field">Internal notes<textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Only your team will see this." /></label><button onClick={() => onUpdate(type, record.id, { admin_notes: notes })} className="rounded-full bg-forest px-5 py-3 font-bold text-white hover:bg-olive"><Check className="mr-2 inline" size={16} />Save notes</button><button onClick={() => onDelete(type, record.id)} className="text-sm font-semibold text-red-700 hover:underline">Delete request</button></div></aside></div>;
}

function SettingsPanel({ username }: { username: string }) {
  return <div className="mt-8 max-w-xl rounded-2xl border border-forest/10 bg-white p-7"><p className="eyebrow">Account</p><h2 className="mt-3 font-display text-3xl">Private workspace settings</h2><p className="mt-4 text-sm leading-6 text-olive">You are signed in as the administrator below. The first username and password set up on this portal became the permanent login.</p><div className="mt-7 flex items-center gap-3 rounded-xl bg-cream p-4 text-sm font-semibold"><User size={18} className="text-olive" />{username}</div></div>;
}

export default AdminApp;
