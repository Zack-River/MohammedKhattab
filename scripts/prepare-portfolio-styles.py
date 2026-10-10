"""Scope the approved reference CSS and centralize its visual constants.
No browser/runtime dependencies: regenerate after intentionally updating the source archive.
"""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / 'docs/evidence/portfolio-reference/style.css').read_text()
source = re.sub(r'/\*.*?\*/', '', source, flags=re.S)
root_match = re.search(r':root\s*\{(.*?)\}', source, re.S)
source = source[:root_match.start()] + source[root_match.end():]
aliases = {
    'bg-dark': 'var(--bg-main)', 'bg-dark-elevated': 'var(--portfolio-elevated)',
    'bg-dark-card': 'var(--portfolio-surface)', 'primary-orange': 'var(--primary-red)',
    'primary-orange-hover': 'var(--primary-red-hover)', 'primary-orange-glow': 'var(--primary-red-glow)',
    'primary-orange-border': 'var(--primary-red-border)', 'text-white': 'var(--text-primary)',
    'text-primary': 'var(--portfolio-text)', 'text-muted': 'var(--portfolio-muted)',
    'font-family': 'var(--font-arabic)', 'container-max': 'var(--container-max)',
}
tokens = {}
for declaration in root_match.group(1).split(';'):
    if ':' not in declaration: continue
    name, value = declaration.split(':', 1)
    name = name.strip().removeprefix('--')
    if name == 'transition-smooth': continue
    tokens['--personal-reference-' + name] = aliases.get(name, value.strip())

palette = {'#101317': 'var(--bg-main)', '#fc3522': 'var(--primary-red)',
           '#ffffff':'var(--text-primary)', '#fff':'var(--text-primary)',
           '#94a3b8':'var(--portfolio-muted)', '#14171d':'var(--portfolio-surface)'}
def constant(match):
    value = match.group(0)
    if value.lower() in palette: return palette[value.lower()]
    key = '--personal-reference-value-' + re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')
    if value.startswith('-'): key = key.replace('value-', 'value-negative-', 1)
    red = re.fullmatch(r'rgba\(\s*252\s*,\s*53\s*,\s*34\s*,\s*([\d.]+)\s*\)', value, re.I)
    tokens[key] = 'rgb(from var(--primary-red) r g b / ' + red.group(1) + ')' if red else value
    return 'var(' + key + ')'
constant_pattern = re.compile(r'rgba?\([^)]*\)|#[\da-fA-F]{3,8}\b|(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|vw|vh|ch|ms|s|deg)\b')
transition = 'transition-property:transform,color,background-color,border-color,box-shadow,opacity,width,padding; transition-duration:var(--motion-duration-surface); transition-timing-function:var(--motion-easing);'

def declarations(body):
    body = re.sub(r'var\(--([\w-]+)\)', lambda m:'var(--personal-reference-'+m.group(1)+')', body)
    body = re.sub(r'\btransition\s*:[^;]+;', transition, body)
    body = body.replace('subtleHaloGlow', 'personal-reference-halo')
    return constant_pattern.sub(constant, body)

def stylesheet(text, keyframes=False):
    output=[]
    pos=0
    while pos < len(text):
        start=text.find('{',pos)
        if start < 0: break
        selector=text[pos:start].strip()
        depth=1; end=start+1
        while depth:
            if text[end]=='{': depth+=1
            elif text[end]=='}': depth-=1
            end+=1
        body=text[start+1:end-1]
        pos=end
        if selector.startswith('@media'):
            contents=stylesheet(body)
            if contents: output.append(selector+' {\n'+contents+'\n}')
        elif selector.startswith('@keyframes'):
            output.append(selector.replace('subtleHaloGlow','personal-reference-halo')+' {\n'+stylesheet(body,True)+'\n}')
        else:
            if any(unused in selector for unused in ['.video-modal','.featured-', '.video-play-badge', '.course-featured-', '.reels-grid-title', '.btn-whatsapp']): continue
            if keyframes:
                output.append(selector+' { '+declarations(body)+' }')
                continue
            scoped=[]
            for part in selector.split(','):
                part=part.strip()
                part=re.sub(r'\.([a-zA-Z][\w-]*)',r'.p-ref-\1',part)
                part=re.sub(r'#([a-zA-Z][\w-]*)',r'#p-ref-\1',part)
                if part in ['html','body']: scoped.append('.personal-site')
                else: scoped.append('.personal-site '+part)
            output.append(', '.join(scoped)+' { '+declarations(body)+' }')
    return '\n'.join(output)
css = stylesheet(source)
# Integration adapters preserve the portable player's own controls and behavior.
css+='''
.personal-site .personal-header-actions { display:flex;align-items:center;gap:var(--personal-reference-value-12px); }
.personal-site .p-ref-timeline-progress-bar { transform:scaleY(var(--personal-progress,0)); }
.personal-site .p-ref-timeline-item.is-active .p-ref-timeline-node { background:var(--primary-red);border-color:var(--primary-red);transform:scale(1.25);box-shadow:0 0 var(--personal-reference-value-14px) var(--primary-red-glow); }
.personal-site .media-player-poster img { height:100%;object-fit:cover;transition:transform var(--transition-smooth); }
.personal-site .personal-work-card:hover .media-player-poster img { transform:scale(1.06); }
.personal-site .media-player { height:100%; }
.personal-site .media-player video { height:100%; }
.personal-site .personal-course-upcoming .p-ref-course-yt-cta { color:var(--portfolio-muted); }
.personal-site .personal-skip { position:fixed;top:0;left:0;transform:translateY(-200%);z-index:var(--layer-navigation-menu);background:var(--bg-main);padding:var(--space-md); }
.personal-site .personal-skip:focus { transform:translateY(0); }
@media(prefers-reduced-motion:reduce) {
  .personal-site *, .personal-site *::before, .personal-site *::after { animation:none!important;transition-duration:var(--motion-duration-instant)!important; }
  .personal-site [class*="p-ref-"]:hover, .personal-site [class*="p-ref-"]:hover img, .personal-site [class*="p-ref-"]:hover svg { transform:none; }
}
'''
# Keep only generated roles reachable from the generated stylesheet/role graph.
used = set(re.findall(r'var\((--[\w-]+)', css))
for _ in range(len(tokens)):
    aliases_used = {alias for name in used if name in tokens
                    for alias in re.findall(r'var\((--[\w-]+)', tokens[name])}
    if aliases_used.issubset(used): break
    used.update(aliases_used)
tokens = {name: value for name, value in tokens.items() if name in used}
# Native aspect-ratio remains structural. Timing/easing always comes from shared roles.
(ROOT/'modules/styles/portfolio.css').write_text('/* Generated from the approved reference by scripts/prepare-portfolio-styles.py. */\n'+css+'\n')
theme_path=ROOT/'packages/design-system/styles/theme.css'
theme=theme_path.read_text()
marker='/* Personal portfolio reference constants — generated by prepare-portfolio-styles.py. */'
if marker in theme: theme=theme[:theme.index(marker)].rstrip()+'\n'
theme+='\n'+marker+'\n:root {\n'+''.join('  '+name+': '+value+';\n' for name,value in sorted(tokens.items()))+'}\n'
theme_path.write_text(theme)
print(f'Restored scoped reference stylesheet with {len(tokens)} centralized constants.')
