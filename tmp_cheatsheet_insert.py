import re

with open(r'c:\Users\abila\Desktop\hobby projects\fiberoptics learn\src\components\viz\Module2Modes.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Cheat sheet 1: AttenuationLab
attenuation_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Signal Attenuation — Equation Summary" equations={[
        { name: 'Transmission Loss (dB)', math: 'L_{\\\\text{dB}} = 10\\\\log_{10}\\\\!\\\\left(\\\\dfrac{P_{\\\\text{in}}}{P_{\\\\text{out}}}\\\\right)', color: 'text-red-600', description: 'Converts a power ratio into decibels. A 10x power drop = 10 dB. A 100x drop = 20 dB. Simply add dB losses in a chain.' },
        { name: 'Loss Coefficient', math: '\\\\alpha = \\\\dfrac{L_{\\\\text{dB}}}{L}', color: 'text-amber-600', description: 'Signal power lost per kilometer. Silica at 1550nm achieves α ≈ 0.2 dB/km — the lowest achievable loss window in glass.' },
        { name: 'Rayleigh Scattering', math: '\\\\alpha_{\\\\text{scat}} \\\\propto \\\\lambda^{-4}', color: 'text-cyan-600', description: 'Scattering drops sharply at longer wavelengths (4th power). 1550nm has 18x less scattering than 850nm.' },
        { name: 'Output Power', math: 'P_{\\\\text{out}} = P_{\\\\text{in}} \\\\cdot 10^{-\\\\alpha L / 10}', color: 'text-blue-600', description: 'Remaining power after L km of fiber with loss α. Core formula for link budget calculations.' },
      ]} />"""

old1 = '       </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   2. PULSE DISPERSION'
new1 = '       </div>\n      </div>\n' + attenuation_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   2. PULSE DISPERSION'
content = content.replace(old1, new1, 1)

# Cheat sheet 2: PulseDispersion
dispersion_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Pulse Dispersion — Equation Summary" equations={[
        { name: 'Chromatic Dispersion Delay', math: '\\\\Delta\\\\tau_{\\\\text{chrom}} = D(\\\\lambda)\\\\cdot L\\\\cdot\\\\Delta\\\\lambda', color: 'text-emerald-600', description: 'Pulse broadening (ps) from chromatic dispersion. D (ps/nm·km) × length (km) × source width (nm). D≈0 at 1310nm for standard SMF.' },
        { name: 'Modal Dispersion Delay', math: '\\\\Delta\\\\tau_{\\\\text{modal}} = \\\\dfrac{L\\\\cdot n_1}{c}\\\\cdot\\\\Delta', color: 'text-purple-600', description: 'Pulse broadening in multimode fibers. Rays take different paths, arriving at different times. GI fiber equalizes travel time.' },
        { name: 'Bandwidth-Distance Product', math: 'B \\\\cdot L = \\\\dfrac{1}{2\\\\,\\\\Delta\\\\tau}', color: 'text-blue-600', description: 'The max data rate B times link length L is a constant fixed by dispersion. Halving dispersion doubles achievable bandwidth.' },
        { name: 'Material Dispersion', math: 'D_m = -\\\\dfrac{\\\\lambda}{c}\\\\dfrac{d^2n}{d\\\\lambda^2}', color: 'text-cyan-600', description: 'Caused by wavelength-dependent refractive index of silica. Zero near 1270nm. Key SMF design target.' },
      ]} />"""

old2 = '         </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   3. DISPERSION TUNING'
new2 = '         </div>\n      </div>\n' + dispersion_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   3. DISPERSION TUNING'
content = content.replace(old2, new2, 1)

# Cheat sheet 3: DispersionTuning
tuning_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="Dispersion Engineering — Equation Summary" equations={[
        { name: 'Total Chromatic Dispersion', math: 'D(\\\\lambda) = D_m(\\\\lambda) + D_w(\\\\lambda)', color: 'text-blue-600', description: 'Total dispersion = material + waveguide contributions. Changing core geometry shifts the zero-dispersion wavelength.' },
        { name: 'Zero-Dispersion Condition', math: '\\\\lambda_0:\\\\; D(\\\\lambda_0) = 0', color: 'text-emerald-600', description: 'At this wavelength, chromatic dispersion is zero. Standard SMF: λ₀≈1310nm. DSF moves it to 1550nm for long-haul links.' },
        { name: 'Dispersion Slope', math: 'S_0 = \\\\left.\\\\dfrac{dD}{d\\\\lambda}\\\\right|_{\\\\lambda_0}', color: 'text-purple-600', description: 'Rate of change of D at the zero-dispersion point (ps/nm²/km). Determines dispersion spread across WDM channels.' },
      ]} />"""

old3 = '        </div>\n      </div>\n    </div>\n  );\n};\n\n/* =========================================\n   4. POLARIZATION'
new3 = '        </div>\n      </div>\n' + tuning_sheet + '\n    </div>\n  );\n};\n\n/* =========================================\n   4. POLARIZATION'
content = content.replace(old3, new3, 1)

# Cheat sheet 4: PolarizationPMD — find its closing
pmd_sheet = """
      {/* Equation Cheat Sheet */}
      <EquationCheatSheet title="PMD — Equation Summary" equations={[
        { name: 'Average DGD', math: '\\\\langle\\\\text{DGD}\\\\rangle = D_{\\\\text{PMD}}\\\\cdot\\\\sqrt{L}', color: 'text-cyan-600', description: 'Average Differential Group Delay scales with sqrt(L) not L, because PMD is a random walk. D_PMD is typically 0.1-0.5 ps/sqrt(km).' },
        { name: 'Birefringence', math: '\\\\Delta n = n_x - n_y', color: 'text-purple-600', description: 'Refractive index difference between two polarization axes. Determines how fast the two polarizations separate in time.' },
        { name: 'Beat Length', math: 'L_B = \\\\dfrac{\\\\lambda}{\\\\Delta n}', color: 'text-blue-600', description: 'Distance for two polarizations to complete one full relative phase cycle. Shorter beat length = higher birefringence.' },
      ]} />"""

old4 = '          </div>\n       </div>\n    </div>\n   );\n}'
new4 = '          </div>\n       </div>\n' + pmd_sheet + '\n    </div>\n   );\n}'
content = content.replace(old4, new4, 1)

with open(r'c:\Users\abila\Desktop\hobby projects\fiberoptics learn\src\components\viz\Module2Modes.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

count = content.count('EquationCheatSheet')
print(f'Done. EquationCheatSheet occurrences: {count}')
# Verify each section
for label in ['Signal Attenuation', 'Pulse Dispersion', 'Dispersion Engineering', 'PMD']:
    found = label in content
    print(f'  {label}: {"OK" if found else "MISSING"}')
