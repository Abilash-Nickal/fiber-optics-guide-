import os

path = r'c:\Users\abila\Desktop\hobby projects\fiberoptics learn\src\components\viz\Module3Attenuation.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# --- 1. Lasing Dynamics ---
lasing_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Lasing Dynamics — Equation Summary" equations={[
        { name: 'Threshold Current (Temp)', math: 'I_{th}(T) = I_{th}(T_{ref}) \\\\cdot e^{(T-T_{ref})/T_0}', color: 'text-red-600', description: 'Describes how the threshold current increases exponentially with temperature. T₀ is the characteristic temperature — higher T₀ means the laser is more thermally stable.' },
        { name: 'External Quantum Efficiency', math: '\\\\eta_{ext} = \\\\dfrac{q}{E_g} \\\\dfrac{dP}{dI}', color: 'text-amber-600', description: 'The slope of the P-I curve above threshold. It represents how efficiently the laser converts injection current into useful output power.' },
      ]} />"""

marker1 = '            </div>\n         </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   3. PHOTODETECTOR'
content = content.replace(marker1, '            </div>\n         </div>\n      </div>' + lasing_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   3. PHOTODETECTOR', 1)

# --- 2. Detection Physics ---
detect_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Detection Physics — Equation Summary" equations={[
        { name: 'Quantum Efficiency (η)', math: '\\\\eta = \\\\dfrac{\\\\text{electrons out}}{\\\\text{photons in}}', color: 'text-cyan-600', description: 'The probability that a single photon hitting the detector will result in a recorded electron-hole pair. Always ≤ 100%.' },
        { name: 'APD Multiplication Gain', math: 'M = \\\\dfrac{I_{APD}}{I_{primary}}', color: 'text-purple-600', description: 'In Avalanche Photo Diodes, a single photon can trigger an avalanche of carriers, providing internal gain M. This increases sensitivity but also adds noise.' },
      ]} />"""

marker2 = '         </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   4. RESPONSIVITY'
content = content.replace(marker2, '         </div>\n      </div>\n' + detect_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   4. RESPONSIVITY', 1)

# --- 3. Device Responsivity ---
resp_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Device Responsivity — Equation Summary" equations={[
        { name: 'Responsivity (R)', math: 'R = \\\\dfrac{\\\\eta q}{h\\\\nu} = \\\\dfrac{\\\\eta\\\\lambda}{1240}', color: 'text-blue-600', description: 'The ratio of photocurrent to incident optical power (Amps per Watt). It increases linearly with wavelength λ as long as it is below the cutoff.' },
        { name: 'Long-Wavelength Cutoff', math: '\\\\lambda_c = \\\\dfrac{hc}{E_g} \\\\approx \\\\dfrac{1240}{E_g\\\\text{(eV)}}', color: 'text-emerald-600', description: 'The maximum wavelength a detector can see. Above this, the photon energy is too low to excite an electron across the bandgap Eg.' },
      ]} />"""

marker3 = '         </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   5. JOINTS, SPLICES & CONNECTIONS'
content = content.replace(marker3, '         </div>\n      </div>\n' + resp_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   5. JOINTS, SPLICES & CONNECTIONS' , 1)

# --- 4. Link Integration ---
link_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Link Integration — Equation Summary" equations={[
        { name: 'Total Link Loss', math: 'L_{total} = \\\\alpha L + n_{sc} L_{sc} + n_c L_c', color: 'text-emerald-600', description: 'Total loss = fiber attenuation + splice losses + connector losses. This total must be less than the system power budget.' },
        { name: 'Power in dBm', math: 'P_{\\\\text{dBm}} = 10\\\\log_{10}\\\\left(\\\\dfrac{P_{mW}}{1\\\\text{ mW}}\\\\right)', color: 'text-blue-600', description: 'Power relative to 1 milliwatt. 0 dBm = 1 mW. Decibels make it easy to subtract component losses.' },
      ]} />"""

marker4 = '         </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   6. ADVANCED PROBLEM SOLVER'
content = content.replace(marker4, '         </div>\n      </div>\n' + link_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   6. ADVANCED PROBLEM SOLVER' , 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Done. Occurrences of EquationCheatSheet: {content.count("EquationCheatSheet")}')
