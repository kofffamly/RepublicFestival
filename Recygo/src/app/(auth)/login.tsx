/**
 * Connexion — RecyGo CI
 * Login screen with Firebase Auth integration.
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Animated, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';

const COL = {
  dark: '#0F5C34',
  mid: '#1E7A46',
  cta: '#2ECC71',
  white: '#FFFFFF',
  dtxt: '#1A1A1A',
  gray: '#6B7280',
  border: '#D1D5DB',
  ibg: '#F9FAFB',
};

function Fade({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(24)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(ty, { toValue: 0, friction: 8, tension: 60, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[{ opacity: op, transform: [{ translateY: ty }] }, style]}>{children}</Animated.View>;
}

export default function Login() {
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { login, error: authError } = useApp();
  const ins = useSafeAreaInsets();
  const [idf, setIdf] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { if (authError) setErr(authError); }, [authError]);

  const doLogin = async () => {
    if (!idf.trim()) { setErr('Veuillez entrer votre e-mail ou téléphone'); return; }
    if (!pw.trim()) { setErr('Veuillez entrer votre mot de passe'); return; }
    setErr('');
    setLoading(true);
    try {
      const email = idf.includes('@') ? idf.trim() : `${idf.trim()}@recygo.ci`;
      await login(email, pw);
      router.replace('/(tabs)/home');
    } catch { /* handled */ }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: COL.white }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingTop: ins.top }} keyboardShouldPersistTaps="handled" bounces={false}>
        <View style={st.header}>
          <View style={st.overlay} />
          <Fade delay={0} style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 16, color: COL.white }}>♻️</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: COL.white, opacity: 0.9 }}>RecyGo CI</Text>
            </View>
          </Fade>
          <Fade delay={100} style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: COL.white, marginBottom: 8 }}>Bon retour ! 👋</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Connectez-vous pour continuer</Text>
          </Fade>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 28 }}>
          <Fade delay={150}>
            <View style={{ marginBottom: 20 }}>
              <Text style={st.label}>E-MAIL OU TÉLÉPHONE</Text>
              <View style={st.inp}>
                <Text style={{ fontSize: 16, marginRight: 10, opacity: 0.6 }}>📧</Text>
                <TextInput style={st.input} placeholder="aya.kouassi@example.com" placeholderTextColor="#9CA3AF" value={idf} onChangeText={setIdf} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
              </View>
          </Fade>

          <Fade delay={200}>
            <View style={{ marginBottom: 20 }}>
              <Text style={st.label}>MOT DE PASSE</Text>
              <View style={st.inp}>
                <Text style={{ fontSize: 16, marginRight: 10, opacity: 0.6 }}>🔒</Text>
                <TextInput style={st.input} placeholder="••••••••" placeholderTextColor="#9CA3AF" value={pw} onChangeText={setPw} secureTextEntry={!showPw} autoCapitalize="none" editable={!loading} />
                <Pressable onPress={() => setShowPw(!showPw)} style={{ padding: 6 }}>
                  <Text style={{ fontSize: 16, opacity: 0.6 }}>{showPw ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
          </Fade>

          <Fade delay={250}>
            <Pressable style={{ alignItems: 'flex-end', marginBottom: 24 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COL.cta }}>Mot de passe oublié ?</Text>
            </Pressable>
          </Fade>

          {err ? (
            <Fade delay={100}>
              <View style={{ backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#DC2626' }}>⚠️ {err}</Text>
              </View>
            </Fade>
          ) : null}

          <Fade delay={300}>
            <Pressable onPress={doLogin} disabled={loading} style={({ pressed }) => [st.btn, { opacity: loading ? 0.7 : pressed ? 0.9 : 1 }]}>
              {loading ? <ActivityIndicator size="small" color={COL.white} /> : <Text style={{ fontSize: 16, fontWeight: '700', color: COL.white }}>Se connecter</Text>}
            </Pressable>
          </Fade>

          <Fade delay={350}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
              <Text style={{ fontSize: 12, color: COL.gray }}>ou</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            </View>
          </Fade>

          <Fade delay={400}>
            <Pressable style={({ pressed }) => [st.gbtn, { opacity: pressed ? 0.9 : 1 }]}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#4285F4' }}>G</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COL.dtxt }}>Continuer avec Google</Text>
            </Pressable>
          </Fade>

          <Fade delay={450}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
              <Text style={{ fontSize: 13, color: COL.gray }}>Pas encore de compte ? </Text>
              <Pressable onPress={() => router.push(`/(auth)/register?role=${roleParam || 'citizen'}`)}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COL.cta }}>S'inscrire</Text>
              </Pressable>
            </View>
          </Fade>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  header: {
    height: 260, backgroundColor: COL.mid, borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    overflow: 'hidden', paddingHorizontal: 24, paddingTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COL.dark, opacity: 0.25 },
  label: { fontSize: 11, fontWeight: '700', color: COL.gray, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  inp: { flexDirection: 'row', alignItems: 'center', backgroundColor: COL.ibg, borderWidth: 1, borderColor: COL.border, borderRadius: 12, paddingHorizontal: 14, height: 50 },
  input: { flex: 1, fontSize: 15, fontWeight: '500', color: COL.dtxt, paddingVertical: 0 },
  btn: { width: '100%', height: 52, borderRadius: 999, backgroundColor: COL.cta, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: COL.cta, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  gbtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', height: 50, borderRadius: 999, backgroundColor: COL.white, borderWidth: 1, borderColor: COL.border },
});
