<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_rumah',
        'alamat',
        'status_hunian',
        'current_resident_id',
        'keterangan',
    ];

    public function currentResident()
    {
        return $this->belongsTo(Resident::class, 'current_resident_id');
    }

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function activeHouseResident()
    {
        return $this->hasOne(HouseResident::class)->where('is_active', true)->latest();
    }

    public function residents()
    {
        return $this->belongsToMany(Resident::class, 'house_residents')
            ->withPivot(['tanggal_masuk', 'tanggal_keluar', 'is_active', 'catatan'])
            ->withTimestamps()
            ->orderByPivot('tanggal_masuk', 'desc');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
