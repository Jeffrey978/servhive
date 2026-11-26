import { useState } from 'react';

import { Button, Card, Check, Field, Gap, Notice, QueryView, Row, Screen, Select, T } from '@/components/ui';
import { useMeta } from '@/lib/api';
import { naira } from '@/lib/format';
import { openLegal } from '@/lib/links';
import { useSession } from '@/lib/session';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';
import { useSignOut } from '@/components/push-provider';

/** First-time set-up: choose client or artisan, then the same fields as the website's /onboarding. */
export default function Onboarding() {
  const meta = useMeta();
  const session = useSession();
  const signOut = useSignOut();
  const [role, setRole] = useState<'CLIENT' | 'ARTISAN' | null>(null);

  return (
    <Screen keyboard>
      <QueryView query={meta}>
        {(m) =>
          !role ? (
            <Gap size={space.lg}>
              <Gap size={space.xs}>
                <T v="title">Welcome to Servhive</T>
                <T color="muted">How will you use Servhive? You can't switch later from the app.</T>
              </Gap>
              <Card onPress={() => setRole('CLIENT')}>
                <Row icon="search" title="I want to hire" subtitle="Find verified artisans, get quotes and pay safely through escrow." chevron />
              </Card>
              <Card onPress={() => setRole('ARTISAN')}>
                <Row
                  icon="hammer"
                  title="I'm an artisan"
                  subtitle={`Get jobs and keep 100% of every job. The first ${m.rules.freeTrialSlots} artisans get ${m.rules.freeTrialMonths} month free.`}
                  chevron
                />
              </Card>
              <Button title="Sign out" kind="ghost" onPress={() => signOut()} />
            </Gap>
          ) : (
            <Details role={role} defaultName={session.me?.user.name ?? ''} meta={m} onBack={() => setRole(null)} />
          )
        }
      </QueryView>
    </Screen>
  );
}

function Details({
  role,
  defaultName,
  meta,
  onBack,
}: {
  role: 'CLIENT' | 'ARTISAN';
  defaultName: string;
  meta: NonNullable<ReturnType<typeof useMeta>['data']>;
  onBack: () => void;
}) {
  const { submit, pending, error } = useSubmit('onboarding.complete');
  const [name, setName] = useState(defaultName);
  const [area, setArea] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subSpecialty, setSubSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [consent, setConsent] = useState(false);
  const artisan = role === 'ARTISAN';

  function onSubmit() {
    const body: Record<string, unknown> = { role, name, area, consent: consent ? 'yes' : '' };
    if (artisan) Object.assign(body, { businessName, categoryId, subSpecialty, phone, startingPrice, yearsExperience });
    // On success the session refreshes and the app moves to the right home by itself.
    submit(body);
  }

  return (
    <Gap size={space.lg}>
      <Gap size={space.xs}>
        <T v="h2">{artisan ? 'Your business' : 'About you'}</T>
        <T color="muted">{artisan ? 'This becomes your profile. You can add photos and documents next.' : 'So artisans know where the job is.'}</T>
      </Gap>
      <Field label={artisan ? 'Your full name' : 'Your name'} value={name} onChangeText={setName} autoComplete="name" />
      {artisan ? (
        <>
          <Field label="Business name" value={businessName} onChangeText={setBusinessName} placeholder="e.g. Bright Spark Electricals" />
          <Select
            label="Your trade"
            value={categoryId}
            onChange={setCategoryId}
            options={meta.categories.map((c) => ({ value: c.id, label: c.name, meta: c.requiresLicence ? 'Needs a trade licence' : undefined }))}
          />
          <Field label="Speciality (optional)" value={subSpecialty} onChangeText={setSubSpecialty} placeholder="e.g. Inverter installation" />
        </>
      ) : null}
      <Select label={artisan ? 'Where you are based' : 'Your area'} value={area} onChange={setArea} options={meta.areas.map((a) => ({ value: a, label: a }))} />
      {artisan ? (
        <>
          <Field label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="080..." autoComplete="tel" />
          <Field
            label="Starting price (₦)"
            value={startingPrice}
            onChangeText={setStartingPrice}
            keyboardType="number-pad"
            hint={`At least ${naira(meta.rules.minStartingPrice)}`}
          />
          <Field label="Years of experience" value={yearsExperience} onChangeText={setYearsExperience} keyboardType="number-pad" />
        </>
      ) : null}
      <Check checked={consent} onChange={setConsent}>
        <T v="small" color="muted">
          I am 18 or over and I accept the{' '}
          <T v="small" color="accent" onPress={() => openLegal(artisan ? 'provider' : 'terms')}>
            {artisan ? 'Provider Agreement' : 'Terms of Use'}
          </T>
          , the{' '}
          <T v="small" color="accent" onPress={() => openLegal('protection')}>
            Payment Protection Terms
          </T>{' '}
          and the{' '}
          <T v="small" color="accent" onPress={() => openLegal('privacy')}>
            Privacy Policy
          </T>
          .
        </T>
      </Check>
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Finish set-up" onPress={onSubmit} loading={pending} />
      <Button title="Back" kind="ghost" onPress={onBack} />
    </Gap>
  );
}
